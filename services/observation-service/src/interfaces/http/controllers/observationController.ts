// Controllers HTTP pour les observations (couche interfaces).
// Pour l'instant, ils renvoient une réponse 501 "Not implemented".

async function notImplemented(req: any, res: any) {
  res.status(501).json({
    status: 'error',
    message: 'Not implemented yet',
    route: `${req.method} ${req.originalUrl}`,
  });
}

export async function createObservation(req: any, res: any) {
  return notImplemented(req, res);
}

export async function listObservationsForSpecies(req: any, res: any) {
  return notImplemented(req, res);
}

export async function validateObservation(req: any, res: any) {
  return notImplemented(req, res);
}

export async function rejectObservation(req: any, res: any) {
  return notImplemented(req, res);
}

