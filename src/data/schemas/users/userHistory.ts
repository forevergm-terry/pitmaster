import { z } from 'zod';

// Define schema for user history events
export const UserHistorySchema = z.object({
    id: z.number().optional(), // ID is auto-incremented
    user_id: z.string(),
    event_type: z.enum(['join', 'leave']),
    event_timestamp: z.string() // Stored as a string (ISO timestamp)
});
export type UserHistory = z.infer<typeof UserHistorySchema>;