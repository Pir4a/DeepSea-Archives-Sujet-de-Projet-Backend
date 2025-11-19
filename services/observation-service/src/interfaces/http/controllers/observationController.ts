// Controllers HTTP pour les observations (couche interfaces).
// Pour l'instant, ils renvoient une réponse 501 "Not implemented".

async function notImplemented(req: any, res: any) {
  res.status(501).json({
    status: 'error',
    message: 'Not implemented yet',
    route: `${req.method} ${req.originalUrl}`,
  });
}

module.exports = {
  createObservation: notImplemented, // POST /observations
  listObservationsForSpecies: notImplemented, // GET /species/:id/observations
  validateObservation: notImplemented, // POST /observations/:id/validate
  rejectObservation: notImplemented, // POST /observations/:id/reject
};


