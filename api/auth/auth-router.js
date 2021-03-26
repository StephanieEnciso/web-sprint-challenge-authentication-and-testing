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
    res.status(500).json("user could not be added")
  }
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', (req, res) => {
  res.end('implement login, please!');
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
