const mongoose = require('mongoose')
const User = require('../../models/user')
const jwt = require('jsonwebtoken')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
  _id: userOneId,
  name: 'app owner',
  email: 'app@owner.com',
  password: 'f4x2zRbI',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, 'mytestkey'),
    },
  ],
}

const setupDatabase = async () => {
  await User.deleteMany()
  await new User(userOne).save()
}

const closeConnection = async () => {
  mongoose.connection.close()
}

module.exports = { userOneId, userOne, setupDatabase, closeConnection }
