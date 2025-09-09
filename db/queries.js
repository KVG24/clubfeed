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
    const { rows } = await pool.query(`
    SELECT 
      c.club_id,
      c.name,
      c.creator_id,
      u.first_name,
      u.last_name,
      u.username,
      COUNT(m.user_id) AS num_of_members
    FROM clubs c
    JOIN users u ON c.creator_id = u.user_id
    LEFT JOIN memberships m ON c.club_id = m.club_id
    GROUP BY c.club_id, u.user_id
    ORDER BY c.club_id
  `);

    // Prepare data for EJS rendering
    return rows.map((r) => ({
        club_id: r.club_id,
        name: r.name,
        creator_id: r.creator_id,
        creator: {
            first_name: r.first_name,
            last_name: r.last_name,
            username: r.username,
        },
        numOfMembers: Number(r.num_of_members),
    }));
}

async function getClubById(id) {
    const { rows } = await pool.query(
        `SELECT * FROM clubs WHERE club_id = $1`,
        [id]
    );
    return rows[0];
}

async function getClubMessages(club_id) {
    const { rows } = await pool.query(
        `SELECT
        m.text,
        to_char(m.created_at, 'DD-MM HH24:MI') as created_at,
        u.username
        FROM messages m
        JOIN users u ON m.user_id = u.user_id
        WHERE club_id = $1
        ORDER BY created_at DESC;`,
        [club_id]
    );
    return rows;
}

async function getClubPassword(club_id) {
    const { rows } = await pool.query(
        `SELECT password
        FROM clubs
        WHERE club_id = $1`,
        [club_id]
    );

    if (rows.length === 0) {
        throw new Error("Club not found");
    }

    return rows[0].password; // return the string
}

async function createClub(name, password, creatorId) {
    await pool.query(
        `INSERT INTO clubs (name, password, creator_id) VALUES ($1, $2, $3)`,
        [name, password, creatorId]
    );
}

async function postMessage(user_id, club_id, text) {
    await pool.query(
        `INSERT INTO messages (user_id, club_id, text) VALUES ($1, $2, $3)`,
        [user_id, club_id, text]
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

async function registerMembership(user_id, club_id) {
    await pool.query(
        `INSERT INTO memberships (user_id, club_id) VALUES ($1, $2)`,
        [user_id, club_id]
    );
}

async function checkMembership(user_id, club_id) {
    const { rows } = await pool.query(
        `SELECT EXISTS (
       SELECT 1 
       FROM memberships 
       WHERE user_id = $1 AND club_id = $2
     ) AS is_member`,
        [user_id, club_id]
    );
    return rows[0].is_member;
}

module.exports = {
    getUser,
    getUserById,
    getClubs,
    getClubById,
    getClubMessages,
    getClubPassword,
    createClub,
    postMessage,
    registerUser,
    registerMembership,
    checkMembership,
};
