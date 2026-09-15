import AsyncStorage from '@react-native-async-storage/async-storage';

export type PMItemType = {
  id: string;
  name: string;
  term: string;
  url: string;
};

const STORAGE_KEY = 'pm_india_list_v1';
const defaultPmList = require('../data/pmList.json') as PMItemType[];

export const readPmList = async () => {
  try {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : defaultPmList;
    return Array.isArray(parsed) && parsed.length ? parsed : [...defaultPmList];
  } catch {
    return [...defaultPmList];
  }
};

export const savePmList = async (items: PMItemType[]) => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const resetPmList = async () => {
  const fresh = [...defaultPmList];
  await savePmList(fresh);
  return fresh;
};
