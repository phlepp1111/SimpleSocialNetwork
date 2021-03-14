const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

module.exports.registerUser = (first, last, email, password_hash) => {
    const q = `
    INSERT INTO users (first, last, email, password_hash)
    VALUES ($1, $2, $3, $4)
    RETURNING id;
    `;
    const params = [first, last, email, password_hash];
    return db.query(q, params);
};

module.exports.getPassword = (email) => {
    const q = "SELECT password_hash, id FROM users WHERE email = $1";
    const params = [email];
    return db.query(q, params);
};

module.exports.updatePassword = (password_hash, email) => {
    const q = "UPDATE users SET password_hash = $1 WHERE email = $2";
    const params = [password_hash, email];
    return db.query(q, params);
};

module.exports.addResetCode = (email, resetCode) => {
    const q = `
    INSERT INTO reset (email, resetCode)
    VALUES ($1, $2)
    ON CONFLICT (email)
    DO
    UPDATE SET resetCode = $2, created_at = CURRENT_TIMESTAMP
    RETURNING *
    `;
    const params = [email, resetCode];
    return db.query(q, params);
};

module.exports.getResetCode = (email) => {
    const q = `SELECT resetCode FROM reset 
    WHERE email = $1
    AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes';
    `;
    const params = [email];
    return db.query(q, params);
};

module.exports.getUser = (id) => {
    const q = `
        SELECT first, last, bio, imageurl FROM users
        WHERE id = $1
    `;
    const params = [id];
    return db.query(q, params);
};

module.exports.updateImage = (id, imageUrl) => {
    const q = `
    UPDATE users
    SET imageUrl = $2
    WHERE id = $1
    RETURNING *
    `;
    const params = [id, imageUrl];
    return db.query(q, params);
};

module.exports.saveBio = (bio, id) => {
    const q = `
    UPDATE users SET bio = ($1)
    WHERE id = ($2)   
    `;
    const params = [bio, id];
    return db.query(q, params);
};
