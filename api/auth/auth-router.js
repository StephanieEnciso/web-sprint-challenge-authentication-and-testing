const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../jokes/jokes-model');
const { jwtSecret } = require('../../config/secrets');
const { userParams } = require('../../data/dbConfig');

function verify(user) {
  return Boolean(user.username && user.password && typeof user.password === 'string')
}

function verifyBody(req, res, next) {
  if(!req.body.username || !req.body.password) {
    res.status(400).json("username and password required")
  } else {
    next()
  }
}

async function verifyUserInDb(req, res, next) {
  try {
    const rows = await User.findBy({username: req.body.username})
    if(!rows.length) {
      next();
    } else {
      res.status(400).json("username taken")
    }
  } catch(err) {
    res.status(500).json(`Server error: ${err.message}`)
  }
}

router.post('/register', verifyBody, verifyUserInDb, (req, res) => {
  const credentials = req.body;

  if(verify(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 10;
    const hash = bcryptjs.hashSync(credentials.password, rounds);
    credentials.password = hash;

    User.insert(credentials)
      .then(user => {
        res.status(201).json(user)
      })
      .catch(err => {
        res.status(500).json(`Server error: ${err.message}`)
      })
  } else {
    res.status(400).json({
      message: "Invalid input type. Must be a string"
    })
  }
});

router.post('/login', verifyBody, (req, res) => {
  const { username, password } = req.body;
  if(verify(req.body)) {
    User.findBy({username: username})
      .then(([user]) => {
        if(user && bcryptjs.compareSync(password, user.password)) {
          const token = makeToken(user)
          res.status(200).json({
            message: `welcome, ${user.username}`,
            token
          })
        } else {
          res.status(401).json("invalid credentials")
        }
      })
      .catch(err => {
        res.json(500).json(`Server error: ${err.message}`)
      })
  } else {
    res.status(400).json({
      message: "Invalid input type. Must be a string"
    })
  }
});

function makeToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  }
  const options = {
    expiresIn: '400s'
  }
  return jwt.sign(payload, jwtSecret, options)
}

module.exports = router;
