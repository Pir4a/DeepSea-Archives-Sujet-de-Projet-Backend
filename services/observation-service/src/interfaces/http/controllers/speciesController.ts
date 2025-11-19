// Controllers HTTP pour les espèces (couche interfaces).
// Pour l'instant, ils renvoient une réponse 501 "Not implemented".

async function notImplemented(req: any, res: any) {
  res.status(501).json({
    status: 'error',
    message: 'Not implemented yet',
    route: `${req.method} ${req.originalUrl}`,
  });
}

module.exports = {
  createSpecies: notImplemented, // POST /species
  getSpeciesById: notImplemented, // GET /species/:id
  listSpecies: notImplemented, // GET /species
};


