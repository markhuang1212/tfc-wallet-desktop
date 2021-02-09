import Redis from 'ioredis'
import child_process from 'child_process'
import path from 'path'
import { app } from 'electron'

class RedisServer {
    process: child_process.ChildProcessWithoutNullStreams
    constructor(port: number) {
        this.process = child_process.spawn(path.join(__dirname, '../bin/redis-server'), ['--port', '6791'], {
            cwd: app.getPath('userData'),
            detached: false
        })
        this.process.stdout.pipe(process.stdout)
        this.process.stderr.pipe(process.stderr)
    }
}

const REDIS_PORT = 6791

const RedisServerShared = new RedisServer(REDIS_PORT)
const RedisClientShared = new Redis(REDIS_PORT);

app.on('before-quit', () => {
    RedisServerShared.process.kill()
})

export { RedisClientShared, RedisServerShared }