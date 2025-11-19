// Domaine : entité Observation
// TODO: ajouter les règles métier (impossibilité de valider sa propre observation,
// délai de 5 minutes entre deux observations de la même species, etc.)

export type ObservationStatus = 'PENDING' | 'VALIDATED' | 'REJECTED';

export type ObservationProps = {
  id?: number | null;
  speciesId: number;
  authorId: number;
  description: string;
  dangerLevel?: number;
  status?: ObservationStatus;
  validatedBy?: number | null;
  validatedAt?: Date | null;
  createdAt?: Date;
  deletedAt?: Date | null;
};

export function createObservation(props: ObservationProps) {
  return {
    id: props.id ?? null,
    speciesId: props.speciesId,
    authorId: props.authorId,
    description: props.description,
    dangerLevel: props.dangerLevel ?? 1,
    status: props.status ?? 'PENDING',
    validatedBy: props.validatedBy ?? null,
    validatedAt: props.validatedAt ?? null,
    createdAt: props.createdAt ?? new Date(),
    deletedAt: props.deletedAt ?? null,
  };
}


