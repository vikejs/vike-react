import { Hono } from 'hono'
import { apply, serve } from '@photonjs/hono'

function startServer() {
  const app = new Hono()
  
  // Apply Vike and Vike extensions middleware
  apply(app)
  
  return serve(app)
}

export default startServer()
