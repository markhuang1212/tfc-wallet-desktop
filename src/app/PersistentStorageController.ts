import { app } from 'electron'
import fs from 'fs'
import v8 from 'v8'
import { promisify } from 'util'
import path from 'path'

class PersistentStorageController<T> {

    path: string

    object?: T

    constructor(path: string) {
        this.path = path
        this.loadSync()
    }

    loadSync() {
        try {
            const fileText = fs.readFileSync(this.path, 'utf-8')
            this.object = this.parseJSON(fileText)
        } catch {
            this.object = undefined
        }
    }

    saveSync() {
        const fileText = this.makeJSON(this.object)
        fs.writeFileSync(this.path, fileText)
    }

    async save() {
        const fileText = this.makeJSON(this.object)
        await promisify(fs.writeFile)(this.path, fileText)
    }

    private parseJSON(text: string) {
        return JSON.parse(text) as T | undefined
    }

    private makeJSON(object: any) {
        return JSON.stringify(object, undefined, 4)
    }

    getObjectCopy() {
        return v8.deserialize(v8.serialize(this.object)) as T | undefined
    }

}

export default PersistentStorageController