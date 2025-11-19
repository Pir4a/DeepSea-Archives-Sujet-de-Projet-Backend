// Logger minimal pour tous les microservices

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];

function log(level: LogLevel, message: string, meta: Record<string, unknown> = {}) {
  if (!levels.includes(level)) level = 'info';

  const payload = {
    level,
    time: new Date().toISOString(),
    message,
    ...meta,
  };

  // Simple console logger pour commencer (facile à remplacer plus tard)
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload));
}

const logger = {
  debug: (msg: string, meta?: Record<string, unknown>) => log('debug', msg, meta),
  info: (msg: string, meta?: Record<string, unknown>) => log('info', msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log('warn', msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log('error', msg, meta),
};

export default logger;


