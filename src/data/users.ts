import db from './db/connection';
import { User, UserSchema } from './schemas/users/user';
import { UserHistory, UserHistorySchema } from './schemas/users/userHistory';

export class Users {
    async addUser(user: User): Promise<void> {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO users (user_id, username, first_joined_at) VALUES (?, ?, ?)`,
                [user.user_id, user.username, user.first_joined_at],
                (err) => (err ? reject(err) : resolve())
            );
        });
    }

    async getUserById(userId: string): Promise<User | undefined> {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT * FROM users WHERE user_id = ?`,
                [userId],
                (err, row) => {
                    if (err) return reject(err);
                    if (!row) return resolve(undefined);
                    resolve(UserSchema.parse(row)); // Validate row with zod
                }
            );
        });
    }

        // Log a join or leave event in user history
        async logUserEvent(event: UserHistory): Promise<void> {
            return new Promise((resolve, reject) => {
                db.run(
                    `INSERT INTO user_history (user_id, event_type, event_timestamp) VALUES (?, ?, ?)`,
                    [event.user_id, event.event_type, event.event_timestamp],
                    (err) => (err ? reject(err) : resolve())
                );
            });
        }
    
        // Get user history events by user_id
        async getUserHistory(userId: string): Promise<UserHistory[]> {
            return new Promise((resolve, reject) => {
                db.all(
                    `SELECT * FROM user_history WHERE user_id = ? ORDER BY event_timestamp DESC`,
                    [userId],
                    (err, rows) => {
                        if (err) return reject(err);
                        resolve(rows.map((row) => UserHistorySchema.parse(row))); // Validate rows with Zod
                    }
                );
            });
        }
}
