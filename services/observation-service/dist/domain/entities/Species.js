"use strict";
// Domaine : entité Species
// TODO: implémenter les règles métier (unicité du nom, calcul de rarityScore, etc.)
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSpecies = createSpecies;
function createSpecies(props) {
    return {
        id: props.id ?? null,
        authorId: props.authorId,
        name: props.name.trim(),
        rarityScore: props.rarityScore ?? 100,
        createdAt: props.createdAt ?? new Date(),
    };
}
