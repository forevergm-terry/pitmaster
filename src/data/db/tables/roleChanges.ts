import db from '../connection';

export const initRoleChangesTable = () => {
    db.run(`
        CREATE TABLE IF NOT EXISTS role_changes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            username TEXT NOT NULL,
            role TEXT NOT NULL,
            action TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Error initializing role_changes table:', err.message);
        } else {
            console.log('role_changes table initialized.');
        }
    });
};
