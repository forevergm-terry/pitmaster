import db from '../connection';

export const initUserHistoryTable = () => {
    db.run(`
        CREATE TABLE IF NOT EXISTS user_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            event_type TEXT NOT NULL CHECK (event_type IN ('join', 'leave')),
            event_timestamp TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Error initializing user_history table:', err.message);
        } else {
            console.log('User history table initialized.');
        }
    });
};
