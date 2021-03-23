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

module.exports.getMostRecent = () => {
    const q = `
    SELECT id, first, last, imageurl, created_at FROM users
    ORDER BY created_at DESC
    LIMIT 3
    `;
    return db.query(q);
};

module.exports.searchPeople = (input) => {
    return db.query(
        `
    SELECT * FROM users WHERE first ILIKE $1 OR last ILIKE $1;`,
        [input + "%"]
    );
};

module.exports.getFriendshipStatus = (sender_id, recipient_id) => {
    const q = `
    SELECT * FROM friendships 
    WHERE (recipient_id = $1 AND sender_id = $2) 
    OR (recipient_id = $2 AND sender_id = $1);
    `;
    const params = [sender_id, recipient_id];
    return db.query(q, params);
};

module.exports.addFriend = (sender_id, recipient_id) => {
    const q = `
    INSERT INTO friendships (sender_id, recipient_id)
    VALUES ($1, $2)
    RETURNING *
    `;
    const params = [sender_id, recipient_id];
    return db.query(q, params);
};

module.exports.deleteFriend = (sender_id, recipient_id) => {
    const q = `
    DELETE FROM friendships 
    WHERE (recipient_id = $1 AND sender_id = $2) 
    OR (recipient_id = $2 AND sender_id = $1)
    RETURNING *
    `;
    const params = [sender_id, recipient_id];
    return db.query(q, params);
};

module.exports.acceptRequest = (sender_id, recipient_id) => {
    const q = `
    UPDATE friendships SET accepted = TRUE
    WHERE (recipient_id = $1 AND sender_id = $2) 
    OR (recipient_id = $2 AND sender_id = $1)
    RETURNING *
    `;
    const params = [sender_id, recipient_id];
    return db.query(q, params);
};

module.exports.getFriendConnections = (sender_id) => {
    const q = `
    SELECT *
    FROM friendships
    JOIN users
    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = false AND sender_id = $1 AND recipient_id = users.id)
    OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)
    `;
    const params = [sender_id];
    return db.query(q, params);
};

module.exports.getChat = () => {
    const q = `
    SELECT chat.id, chat.sender_id, chat.created_at, chat.chat_message, users.first, users.last, users.imageUrl 
    FROM chat
    JOIN users 
    ON users.id = chat.sender_id
    ORDER BY created_at DESC
    LIMIT 10
    `;
    return db.query(q);
};

module.exports.addChat = (chat_message, sender_id) => {
    const q = `
    INSERT INTO chat (sender_id, chat_message)
    VALUES ($1, $2)
    RETURNING id, created_at`;
    const params = [sender_id, chat_message];
    return db.query(q, params);
};
