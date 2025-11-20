"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServiceClient = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const common_1 = require("@deepsea/common");
class AuthServiceClient {
    constructor(baseUrl = process.env.AUTH_SERVICE_URL) {
        this.baseUrl = baseUrl ?? null;
    }
    async sendReputationDelta(event) {
        if (!this.baseUrl) {
            common_1.logger.debug('auth_service_url_missing', {
                reason: 'No AUTH_SERVICE_URL configured',
            });
            return;
        }
        try {
            const response = await (0, node_fetch_1.default)(`${this.baseUrl}/internal/reputation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-service-name': 'observation-service',
                },
                body: JSON.stringify(event),
            });
            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || `HTTP ${response.status}`);
            }
        }
        catch (error) {
            common_1.logger.warn('auth_service_reputation_failed', {
                message: error.message,
                event,
            });
        }
    }
}
exports.AuthServiceClient = AuthServiceClient;
