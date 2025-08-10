import { useEffect, useState } from 'react';

export interface DeviceStatus {
  batteryLevel: number | null; // 0-100
  charging: boolean | null;
  networkType: string | null; // wifi / cellular / ethernet / etc
  effectiveType: string | null; // 4g/3g/etc
  online: boolean;
}

export function useDeviceStatus(): DeviceStatus {
  const [status, setStatus] = useState<DeviceStatus>({
    batteryLevel: null,
    charging: null,
    networkType: null,
    effectiveType: null,
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  });

  useEffect(() => {
    let battery: BatteryManager | null = null;
    let conn: NetworkInformation | undefined;
  let onBatteryLevel: ((ev: Event) => void) | null = null;
  let onBatteryCharging: ((ev: Event) => void) | null = null;
  let onConnChange: ((ev: Event) => void) | null = null;

    const updateOnline = () => setStatus((s) => ({ ...s, online: navigator.onLine }));

    // Battery API
  const setupBattery = async () => {
      try {
        if (navigator.getBattery) {
          battery = await navigator.getBattery();
      const applyBattery = () => setStatus((s) => ({
            ...s,
            batteryLevel: Math.round((battery!.level ?? 0) * 100),
            charging: !!battery!.charging,
          }));
          applyBattery();
      onBatteryLevel = () => applyBattery();
      onBatteryCharging = () => applyBattery();
      battery.addEventListener('levelchange', onBatteryLevel);
      battery.addEventListener('chargingchange', onBatteryCharging);
        }
      } catch (e) {
        // Battery API not supported
      }
    };

    // Network Information API
  const setupConnection = () => {
      conn = navigator.connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      if (conn) {
    const applyConn = () => setStatus((s) => ({
          ...s,
          networkType: (conn!.type || 'unknown') as string,
          effectiveType: (conn!.effectiveType || null) as any,
        }));
        applyConn();
    onConnChange = () => applyConn();
    conn.addEventListener('change', onConnChange);
      }
    };

    setupBattery();
    setupConnection();
    window.addEventListener('online', updateOnline);
    window.addEventListener('offline', updateOnline);

    return () => {
      window.removeEventListener('online', updateOnline);
      window.removeEventListener('offline', updateOnline);
      if (battery) {
        try {
          if (onBatteryLevel) battery.removeEventListener('levelchange', onBatteryLevel);
          if (onBatteryCharging) battery.removeEventListener('chargingchange', onBatteryCharging);
        } catch {}
      }
      if (conn && onConnChange) {
        try { conn.removeEventListener('change', onConnChange); } catch {}
      }
    };
  }, []);

  return status;
}
