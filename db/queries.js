const pool = require("./pool");

async function getUser(username) {
    const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );
    return rows[0];
}

async function getUserById(id) {
    const { rows } = await pool.query(
        "SELECT * FROM users WHERE user_id = $1",
        [id]
    );
    return rows[0];
}

async function getClubs() {
    const { rows } = await pool.query(`SELECT * FROM clubs;`);
    return rows;
}

async function getClubById(id) {
    const { rows } = await pool.query(
        `SELECT * FROM clubs WHERE club_id = $1`,
        [id]
    );
    return rows;
}

async function getClubMessages(club_id) {
    const { rows } = await pool.query(
        `SELECT *
        FROM messages
        WHERE club_id = $1
        ORDER BY created_at DESC;`,
        [club_id]
    );
    return rows;
}

async function createClub(name, password, creatorId) {
    await pool.query(
        `INSERT INTO clubs (name, password, creator_id) VALUES ($1, $2, $3)`,
        [name, password, creatorId]
    );
}

async function registerUser(
    firstName,
    lastName,
    username,
    password,
    email,
    isAdmin
) {
    await pool.query(
        `INSERT INTO users (first_name, last_name, username, password, email, is_Admin) VALUES ($1, $2, $3, $4, $5, $6)`,
        [firstName, lastName, username, password, email, isAdmin]
    );
}

module.exports = {
    getUser,
    getUserById,
    getClubs,
    getClubById,
    getClubMessages,
    createClub,
    registerUser,
};
