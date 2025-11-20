"use strict";
/**
 * Development-only authentication helpers
 * Use these when auth-service is not available yet
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTestToken = generateTestToken;
const common_1 = require("@deepsea/common");
/**
 * Generate a test JWT token for development/testing
 * @param userId - User ID (default: 1)
 * @param role - User role (default: 'USER')
 * @param reputation - User reputation (default: 0)
 * @returns JWT token string
 */
function generateTestToken(userId = 1, role = 'USER', reputation = 0) {
    const payload = {
        id: userId,
        role,
        reputation,
    };
    return common_1.jwt.signPayload(payload, { expiresIn: '24h' });
}
