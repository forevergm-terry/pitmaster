import { z } from 'zod';

// Define RoleChange Schema
export const RoleChangeSchema = z.object({
    id: z.number().optional(), // ID is optional because it's auto-incremented
    user_id: z.string(),
    username: z.string(),
    role: z.string(),
    action: z.string(),
    timestamp: z.string() // SQLite stores dates as strings
});

// Export TypeScript type from the schema
export type RoleChange = z.infer<typeof RoleChangeSchema>;
