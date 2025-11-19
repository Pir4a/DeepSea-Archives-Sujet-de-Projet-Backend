// Controllers HTTP pour les espèces (couche interfaces).
// Pour l'instant, ils renvoient une réponse 501 "Not implemented".

async function notImplemented(req: any, res: any) {
  res.status(501).json({
    status: 'error',
    message: 'Not implemented yet',
    route: `${req.method} ${req.originalUrl}`,
  });
}

export async function createSpecies(req: any, res: any) {
  return notImplemented(req, res);
}

export async function getSpeciesById(req: any, res: any) {
  return notImplemented(req, res);
}

export async function listSpecies(req: any, res: any) {
  return notImplemented(req, res);
}

