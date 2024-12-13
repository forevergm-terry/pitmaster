import { initEncounterTable } from './encounters';
import { initUsersTable } from './users';
import { initUserHistoryTable } from './userHistory';
import { initRoleChangesTable } from './roleChanges';

export const initializeTables = () => {
    initEncounterTable();
    initUsersTable();
    initUserHistoryTable();
    initRoleChangesTable();
};