"use strict";
// Logger minimal pour tous les microservices
Object.defineProperty(exports, "__esModule", { value: true });
const levels = ['debug', 'info', 'warn', 'error'];
function log(level, message, meta = {}) {
    if (!levels.includes(level))
        level = 'info';
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
    debug: (msg, meta) => log('debug', msg, meta),
    info: (msg, meta) => log('info', msg, meta),
    warn: (msg, meta) => log('warn', msg, meta),
    error: (msg, meta) => log('error', msg, meta),
};
exports.default = logger;
