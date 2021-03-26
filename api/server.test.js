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
    let res = await request(server).post('/api/auth/register').send({})
    expect(res.statusCode).toEqual(400)
    res = await request(server).post('/api/auth/register').send({username: 'abc'})
    expect(res.statusCode).toEqual(400)
    res = await request(server).post('/api/auth/register').send({password: 'abc123'})
    expect(res.statusCode).toEqual(400)
  })
  it('respons with message: "username and password required" if either is missing', async () => {
    let res = await request(server).post('/api/auth/register').send({})
    expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/username and password required/i))
    res = await request(server).post('/api/auth/register').send({username: 'abc'})
    expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/username and password required/i))
    res = await request(server).post('/api/auth/register').send({password: 'abc123'})
    expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/username and password required/i))
  })
})