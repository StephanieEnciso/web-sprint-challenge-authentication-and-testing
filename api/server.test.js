const request = require('supertest')
const server = require('./server')
const db = require('../data/dbConfig')

test('sanity', () => {
  expect(true).toBe(true)
})

const user = { username: 'abc', password: 'abc123'}
const wrongPass = {username: 'abc', password: '321cba'}

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async (done) => {
  await db.destroy()
  done()
})

describe('testing [POST] /api/auth/register', () => {
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
  it('responds with message: "username and password required" if either is missing', async () => {
    let res = await request(server).post('/api/auth/register').send({})
    expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/username and password required/i))
    res = await request(server).post('/api/auth/register').send({username: 'abc'})
    expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/username and password required/i))
    res = await request(server).post('/api/auth/register').send({password: 'abc123'})
    expect(JSON.stringify(res.body)).toEqual(expect.stringMatching(/username and password required/i))
  })
  describe('testing [POST] /api/auth/login', () => {
    beforeEach(async () => {
      await db('users').truncate()
      await request(server).post('/api/auth/register').send(user)
    })
    it('responds with correct status code when login is successful', async () => {
      const res = await request(server).post('/api/auth/login').send(user)
      expect(res.statusCode).toEqual(200)
    })
    it('responds with the correct status code if password is incorrect', async () => {
      const res = await request(server).post('/api/auth/login').send(wrongPass)
      expect(res.statusCode).toEqual(401)
    })
  })
})