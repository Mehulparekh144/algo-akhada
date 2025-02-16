import { env } from '@/env'
import Pusher from 'pusher-js'

const pusherClient = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
})

export default pusherClient