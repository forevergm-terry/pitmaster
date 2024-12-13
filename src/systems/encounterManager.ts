interface Encounter {
    id: string; // Unique encounter ID
    channelId: string;
    activePlayerId: string;
    startedAt: Date;
}

export class EncounterManager {
    private encounters: Map<string, Encounter>;

    constructor() {
        this.encounters = new Map();
    }

    startEncounter(channelId: string, activePlayerId: string, spectators: string[]): Encounter {
        const id = `encounter-${Date.now()}`;
        const encounter: Encounter = {
            id,
            channelId,
            activePlayerId,
            startedAt: new Date()
        };
        this.encounters.set(channelId, encounter);
        return encounter;
    }

    getEncounter(channelId: string): Encounter | undefined {
        return this.encounters.get(channelId);
    }

    endEncounter(channelId: string): boolean {
        return this.encounters.delete(channelId);
    }
}

export const encounterManager = new EncounterManager();
