// Middleware 404 partagé

export default function notFoundHandler(req: any, res: any) {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}


