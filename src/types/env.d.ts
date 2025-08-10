// Ambient types for Battery Status and Network Information APIs
interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number; // 0.0 - 1.0
  addEventListener(type: 'levelchange' | 'chargingchange', listener: (ev: Event) => any): void;
  removeEventListener(type: 'levelchange' | 'chargingchange', listener: (ev: Event) => any): void;
}

interface NetworkInformation extends EventTarget {
  downlink: number;
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  rtt: number;
  saveData: boolean;
  type?: 'bluetooth' | 'cellular' | 'ethernet' | 'wifi' | 'wimax' | 'other' | 'none' | 'unknown';
  addEventListener(type: 'change', listener: (ev: Event) => any): void;
  removeEventListener(type: 'change', listener: (ev: Event) => any): void;
}

interface Navigator {
  getBattery?: () => Promise<BatteryManager>;
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}
