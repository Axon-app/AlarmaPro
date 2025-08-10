export interface CustomSound {
  id: string;
  name: string;
  dataUrl: string; // base64 data URL persisted in localStorage
}

const KEY = 'alarmaPro.customSounds.v1';

export function getCustomSounds(): CustomSound[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CustomSound[]) : [];
  } catch {
    return [];
  }
}

function saveAll(list: CustomSound[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // ignore quota errors
  }
}

export function addCustomSound(name: string, dataUrl: string): CustomSound {
  const item: CustomSound = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    dataUrl,
  };
  const list = getCustomSounds();
  list.push(item);
  saveAll(list);
  return item;
}

export function removeCustomSound(id: string) {
  const list = getCustomSounds().filter((s) => s.id !== id);
  saveAll(list);
}
