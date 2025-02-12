import { env } from '@/env'
import { createClient } from 'redis'

export const redisClient = createClient({
  url: env.REDIS_URL || 'http://localhost:6379'
})

redisClient.on('error', (err) => {
  console.error('Redis error: ', err)
})

await redisClient.connect()
