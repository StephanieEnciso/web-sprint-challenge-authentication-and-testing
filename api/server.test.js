const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

test('sanity', () => {
  expect(true).toBe(true)
})

const user = { username: 'abc', password: 'abc123'}

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async (done) => {
  await db.destroy()
  done()
})

describe('[POST] /api/auth/register', () => {
  beforeEach(async () => {
    await db('users').truncate()
  })
  it('responds with correct error status code if username or password is missing', async () => {
    let res = await await request(server).post('/api/auth/register').send({})
    expect(res.statusCode).toEqual(400)
  })
})