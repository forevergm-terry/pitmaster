import db from './db/connection';
import {RoleChange, RoleChangeSchema} from './schemas/roleChange'

export class RoleChanges {
    async addRoleChange(change: RoleChange): Promise<void> {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO role_changes (user_id, username, role, action, timestamp) VALUES (?, ?, ?, ?, ?)`,
                [
                    change.user_id,
                    change.username,
                    change.role,
                    change.action,
                    change.timestamp
                ],
                (err) => (err ? reject(err) : resolve())
            );
        });
    }

    async getRoleChangesByUser(userId: string): Promise<RoleChange[]> {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT * FROM role_changes WHERE user_id = ? ORDER BY timestamp DESC`,
                [userId],
                (err, rows) => {
                    if (err) {
                        return reject(err);
                    }
                    try {
                        // Validate each row against the RoleChangeSchema
                        const validatedRows = rows.map((row) =>
                            RoleChangeSchema.parse(row)
                        );
                        resolve(validatedRows);
                    } catch (validationError) {
                        reject(validationError);
                    }
                }
            );
        });
    }
}
