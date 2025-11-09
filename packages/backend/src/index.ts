import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('We on hono!')
})

export default app
