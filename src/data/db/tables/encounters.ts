import db from '../connection';

export const initEncounterTable = () => {
    db.run(`
        CREATE TABLE IF NOT EXISTS encounters (
            id TEXT PRIMARY KEY,
            channelId TEXT NOT NULL,
            activePlayerId TEXT NOT NULL,
            startedAt TEXT NOT NULL
        )
    `, (err) => {
        if (err) {
            console.error('Error initializing encounters table:', err.message);
        } else {
            console.log('Encounter table initialized.');
        }
    });
};
