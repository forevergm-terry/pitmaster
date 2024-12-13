import { z } from 'zod';

// Define Encounter schema
export const EncounterSchema = z.object({
    id: z.string(),
    channelId: z.string(),
    activePlayerId: z.string(),
    startedAt: z.string() // Stored as ISO timestamp
});

// Export TypeScript type for Encounter
export type Encounter = z.infer<typeof EncounterSchema>;
