const request = require('supertest');
const db = require('../data/dbConfig');
const server = require('./server');

const  joke1 = {
  joke:
  "I'm tired of following my dreams. I'm just going to ask them where they are going and meet up with them later."
}
const  joke2 = {
  joke:
  "Did you hear about the guy whose whole left side was cut off? He's all right now."
}
test('sanity', () => {
  expect(true).toBe(true)
})

describe('[GET]/jokes', () => {
  it('responds with status 404', async () => {
    const res = await request(server).get("/jokes")
    expect(res.status).toBe(404)
  })
})

describe('[POST]/register', () => {
  it('responds with status 404 ', async () => {
    const res = await request(server).post('/register')
    expect(res.status).toBe(404)
  })
})

describe('[POST]/login', () => {
  it('responds with status 404 ', async () => {
    const res = await request(server).post('/login')
    expect(res.status).toBe(404)
  })
})
