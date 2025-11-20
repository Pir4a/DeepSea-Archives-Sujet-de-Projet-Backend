"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createObservationHistory = createObservationHistory;
function createObservationHistory(props) {
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
