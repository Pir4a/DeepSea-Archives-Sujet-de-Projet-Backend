// Domaine : entité Species
// TODO: implémenter les règles métier (unicité du nom, calcul de rarityScore, etc.)

export type SpeciesProps = {
  id?: number | null;
  authorId: number;
  name: string;
  rarityScore?: number;
  createdAt?: Date;
};

export function createSpecies(props: SpeciesProps) {
  return {
    id: props.id ?? null,
    authorId: props.authorId,
    name: props.name,
    rarityScore: props.rarityScore ?? 1,
    createdAt: props.createdAt ?? new Date(),
  };
}


