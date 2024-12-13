import { z } from 'zod';

// Define schema for users
export const UserSchema = z.object({
    id: z.number().optional(), // ID is auto-incremented
    user_id: z.string(),
    username: z.string(),
    first_joined_at: z.string() // Stored as a string (ISO timestamp)
});

// Export TypeScript types
export type User = z.infer<typeof UserSchema>;
