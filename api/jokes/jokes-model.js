const db = require('../../data/dbConfig')

module.exports = {
    findBy,
    findById,
    insert
}

function findBy(filter) {
    return db('users').where(filter)
}

function findById(id) {
    return db('users').where('id', id).select('id', 'username', 'password').first()
}

async function insert(user) {
    const [id] = await db('users').insert(user, 'id')
    return findById(id)
}