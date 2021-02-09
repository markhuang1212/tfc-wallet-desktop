import Redis from 'ioredis'
import child_process from 'child_process'
import path from 'path'
import { app } from 'electron'

const REDIS_PORT = 6791

const child = child_process.spawn(path.join(__dirname, '../bin/redis-server'), ['--port', '6791'], {
    cwd: app.getPath('userData')
})

child.stdout.pipe(process.stdout)
child.stderr.pipe(process.stderr)

const RedisClientShared = new Redis(REDIS_PORT);

export default RedisClientShared