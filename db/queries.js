const pool = require("./pool");

async function getUser(username) {
    const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );
    return rows[0];
}

async function getUserId(id) {
    const { rows } = await pool.query(
        "SELECT * FROM users WHERE user_id = $1",
        [id]
    );
    return rows[0];
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
    getUserId,
    registerUser,
};
