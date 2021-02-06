import {app} from 'electron';
import path from 'path';
import fs from 'fs';

const userDataPath = app.getPath('userData');
const filePathDefault = path.join(userDataPath, 'AppDataMain.json');

// eslint-disable-next-line require-jsdoc
class PersistentStorage {
  filePath: string;

  data: Map<string, any>;

  // eslint-disable-next-line require-jsdoc
  set(key: string, val: any) {
    this.data.set(key, val);
    fs.writeFile(
        this.filePath,
        JSON.stringify(Object.fromEntries(this.data.entries())),
        () => undefined,
    );
  }

  // eslint-disable-next-line require-jsdoc
  get(key: string) {
    return this.data.get(key);
  }

  // eslint-disable-next-line require-jsdoc
  constructor(filePath = filePathDefault) {
    this.filePath = filePath;
    const dataObj = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
    this.data = new Map(dataObj);
  }
}

/**
 * The wallet stores all essential data in the form of a single json file.
 * This class does not support concurrency of any type,
 * therefore, only the main process should use this class.
 *
 * All UI related data should not be stored in this way.
 * LocalStorage is used instead.
 */
const PersistentStorageShared = new PersistentStorage();

export {PersistentStorage, PersistentStorageShared};
