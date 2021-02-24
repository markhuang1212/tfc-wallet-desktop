import PersistentStorageController from "./PersistentStorageController"
import { app } from 'electron'
import path from 'path'

interface UserConfig {

}

class ConfigurationController {
    config: UserConfig
    configPsc = new PersistentStorageController<UserConfig>(path.join(app.getPath('userData'), 'config.json'))

    constructor() {
        this.configPsc.loadSync()
        if (this.configPsc.object) {
            this.config = this.configPsc.getObjectCopy()!
        } else {
            this.config = {}
            this.configPsc.object = this.config
            this.configPsc.save()
        }
    }

}