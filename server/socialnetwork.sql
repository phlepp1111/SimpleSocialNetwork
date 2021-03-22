-- DROP TABLE IF EXISTS users ; 

-- CREATE TABLE users (
--     id SERIAL PRIMARY KEY,
--     first VARCHAR NOT NULL CHECK (first <> ''),
--     last VARCHAR NOT NULL CHECK (last <> ''),
--     email VARCHAR NOT NULL UNIQUE CHECK (email <> ''),
--     password_hash VARCHAR NOT NULL CHECK (password_hash <> ''),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     imageUrl TEXT,
--     bio TEXT
-- );

-- DROP TABLE IF EXISTS reset;

-- CREATE TABLE reset (
--     id SERIAL PRIMARY KEY,
--     email VARCHAR(255) NOT NULL UNIQUE CHECK (email <> ''),
--     resetCode VARCHAR(255) NOT NULL CHECK (resetCode <> ''),
--     created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- )

-- DROP TABLE IF EXISTS friendships;

-- CREATE TABLE friendships (
--     id SERIAL PRIMARY KEY,
--     sender_id INT REFERENCES users(id) NOT NULL,
--     recipient_id INT REFERENCES users(id) NOT NULL,
--     accepted BOOLEAN DEFAULT false 
-- );

DROP TABLE IF EXISTS chat;

CREATE TABLE chat(
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    chat_message VARCHAR(255) NOT NULL CHECK (chat_message <> '')
);