import db from './db/connection';
import { Encounter, EncounterSchema } from './schemas/encounters/encounter';

export class EncounterData {
    async create(encounter: Encounter): Promise<void> {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO encounters (id, channelId, activePlayerId, startedAt) VALUES (?, ?, ?, ?)`,
                [encounter.id, encounter.channelId, encounter.activePlayerId, encounter.startedAt],
                (err) => (err ? reject(err) : resolve())
            );
        });
    }

    async findByChannel(channelId: string): Promise<Encounter | undefined> {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM encounters WHERE channelId = ?`,
                [channelId],
                (err, row) => {
                    if (err) return reject(err);
                    if (!row) return resolve(undefined);
                    resolve(EncounterSchema.parse(row)); // Validate with zod
                }
            );
        });
    }

    async deleteByChannel(channelId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            db.run(
                `DELETE FROM encounters WHERE channelId = ?`,
                [channelId],
                (err) => (err ? reject(err) : resolve())
            );
        });
    }
}
