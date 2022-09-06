const request = require('supertest')
const app = require('../app')
const User = require('../models/user')
const { userOneId, userOne, setupDatabase, closeConnection } = require('./fixtures/db')

beforeEach(setupDatabase)

afterAll(closeConnection)

test('Should singup a new user', async () => {
  const response = await request(app)
    .post('/users')
    .send({
      name: 'test user',
      email: 'test@user.com',
      password: 'f4x2zRbI',
    })
    .expect(200)

  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  expect(response.body).toMatchObject({
    user: {
      name: 'test user',
      email: 'test@user.com',
    },
    token: user.tokens[0].token,
  })

  expect(user.password).not.toBe('f4x2zRbI')
})

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200)
  const user = await User.findById(userOneId)
  expect(response.body.token).toBe(user.tokens[0].token)
})

test('Should not login nonexisting user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: 'thisisnotmypassword',
    })
    .expect(400)
})

test('Should get profile for user', async () => {
  await request(app).get('/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send().expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app).get('/users/me').send().expect(401)
})

test('Should delete account for user', async () => {
  const response = await request(app).delete('/users/me').set('Authorization', `Bearer ${userOne.tokens[0].token}`).send().expect(200)
  const user = await User.findById(userOneId)
  expect(user).toBeNull()
})

test('Should not delete account for unauthenticated user', async () => {
  await request(app).delete('/users/me').send().expect(401)
})

test('Should upload avatar image', async () => {
  await request(app).post('/users/me/avatar').set('Authorization', `Bearer ${userOne.tokens[0].token}`).attach('avatar', 'tests/fixtures/myavatar.png').expect(200)
  const user = await User.findById(userOneId)
  expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update validate user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
      name: 'New user name',
    })
    .expect(200)
  const user = await User.findById(userOneId)
  expect(user.name).toEqual('New user name')
})
