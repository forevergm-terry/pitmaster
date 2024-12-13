import { Encounter } from '../data/schemas/encounters/encounter';
import { EncounterData } from '../data/encounters';

export class EncounterService {
    private encounterData: EncounterData;

    constructor() {
        this.encounterData = new EncounterData();
    }

    async startEncounter(channelId: string, activePlayerId: string): Promise<Encounter> {
        const existingEncounter = await this.encounterData.findByChannel(channelId);

        if (existingEncounter) {
            throw new Error(`An encounter is already active in channel ${channelId}.`);
        }

        const encounter: Encounter = {
            id: `encounter-${Date.now()}`,
            channelId,
            activePlayerId,
            startedAt: new Date().toISOString()
        };

        await this.encounterData.create(encounter);
        return encounter;
    }

    async getEncounter(channelId: string): Promise<Encounter | undefined> {
        return this.encounterData.findByChannel(channelId);
    }

    async endEncounter(channelId: string): Promise<void> {
        const encounter = await this.encounterData.findByChannel(channelId);

        if (!encounter) {
            throw new Error(`No active encounter found for channel ${channelId}.`);
        }

        await this.encounterData.deleteByChannel(channelId);
    }
}
