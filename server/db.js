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
