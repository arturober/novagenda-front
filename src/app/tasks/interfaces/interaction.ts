export interface TaskInteraction {
    id: string;
    occurrenceDate: string;
    status: 'COMPLETED' | 'CANCELLED';
}