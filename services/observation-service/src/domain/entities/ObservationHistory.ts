export type ObservationHistoryAction =
  | 'CREATED'
  | 'VALIDATED'
  | 'REJECTED'
  | 'DELETED'
  | 'RESTORED';

export type ObservationHistoryProps = {
  id?: number | null;
  observationId: number;
  speciesId: number;
  authorId: number;
  action: ObservationHistoryAction;
  payload?: Record<string, unknown> | null;
  performedBy?: number | null;
  createdAt?: Date;
};

export function createObservationHistory(props: ObservationHistoryProps) {
  return {
    id: props.id ?? null,
    observationId: props.observationId,
    speciesId: props.speciesId,
    authorId: props.authorId,
    action: props.action,
    payload: props.payload ?? null,
    performedBy: props.performedBy ?? null,
    createdAt: props.createdAt ?? new Date(),
  };
}

