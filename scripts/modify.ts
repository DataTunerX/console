/* eslint-disable @typescript-eslint/ban-ts-comment */
import { readFileSync, writeFileSync } from 'fs';

export function updateVersion(path: string, keyPath: string, version: string) {
  const contentBuffer = readFileSync(path);

  const contentStr = contentBuffer.toString();
  const keyList = keyPath.split('.');

  const contentList = contentStr.split('\n');

  let keyIndex = 0;
  let currentKey = keyList[keyIndex];
  let targetLineIndex = -1;
  const keyCount = keyList.length;
  const contentLineCount = contentList.length;

  for (let i = 0; i < contentLineCount; i += 1) {
    const line = contentList[i];

    if (line.includes(currentKey)) {
      if (keyIndex === keyCount - 1) {
        targetLineIndex = i;
        break;
      } else {
        keyIndex += 1;
        currentKey = keyList[keyIndex];
      }
    }
  }

  let lastVersion: false | string = false;

  if (targetLineIndex !== -1) {
    const regexStr = process.env.UI_VERSION_REGEX || '(v\\d*\\.\\d*\\.\\d*)';
    const regex = new RegExp(regexStr);

    const targetLine = contentList[targetLineIndex];

    const nextVersionContent = targetLine.replace(regex, (sub) => {
      lastVersion = sub;

      return version;
    });

    contentList[targetLineIndex] = nextVersionContent;

    writeFileSync(path, contentList.join('\n'));
  }

  return lastVersion;
}
