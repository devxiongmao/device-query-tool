import { describe, test, expect } from "bun:test"
import app from "../src"


describe('GET /', () => {
  test('should return 200', async () => {
    const res = await app.request('/')
    expect(res.status).toBe(200)
  })

  test('should return "We on hono!"', async () => {
    const res = await app.request('/')
    expect(await res.text()).toBe('We on hono!')
  })
})