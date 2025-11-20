"use strict";
// Domaine : entité Observation
// TODO: ajouter les règles métier (impossibilité de valider sa propre observation,
// délai de 5 minutes entre deux observations de la même species, etc.)
Object.defineProperty(exports, "__esModule", { value: true });
exports.createObservation = createObservation;
function createObservation(props) {
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
