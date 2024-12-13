import db from '../connection';

export const initUsersTable = () => {
    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL UNIQUE,
                username TEXT NOT NULL,
                first_joined_at TEXT NOT NULL
            )
        `, (err) => {
            if (err) {
                console.error('Error initializing users table:', err.message);
            } else {
                console.log('Users table initialized.');
            }
        });
    });
};
