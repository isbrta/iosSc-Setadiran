/// <reference types="scriptable-ios" />

import { isString } from './utils';

export const setTimeout = (func: () => void, ms: number): Timer => {
  return Timer.schedule(ms, false, func);
};
export const clearTimeout = (timer: Timer): void => {
  timer.invalidate();
};
export const base64Encode = (str: string): string => {
  const encodedData = Data.fromString(str);
  return encodedData.toBase64String();
};

export const base64Decode = (str: string): string => {
  const decodedData = Data.fromBase64String(str);
  return decodedData.toRawString();
};

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export async function loadFromFile<T extends JsonValue = JsonValue>(
  filename: string,
  parseJson: true,
): Promise<T | null>;
export async function loadFromFile(filename: string, parseJson: false): Promise<string | null>;
export async function loadFromFile(filename: string, parseJson: boolean = true): Promise<JsonValue | string | null> {
  try {
    const fm = FileManager.iCloud();
    const filePath = `${fm.documentsDirectory()}/${filename}`;

    if (!fm.fileExists(filePath)) {
      return null;
    }
    if (!fm.isFileDownloaded(filePath)) {
      await fm.downloadFileFromiCloud(filePath);
    }

    const content = fm.readString(filePath);
    return parseJson ? JSON.parse(content) : content;
  } catch (error) {
    return null;
  }
}

export function saveToFile(filename: string, data: string | JsonValue): boolean {
  try {
    const fm = FileManager.iCloud();
    const filePath = `${fm.documentsDirectory()}/${filename}`;

    const content = isString(data) ? data : JSON.stringify(data);
    fm.writeString(filePath, content);
    return true;
  } catch (error) {
    return false;
  }
}
