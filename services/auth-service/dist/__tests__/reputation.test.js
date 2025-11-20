"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const internalController_1 = require("../controllers/internalController");
const client_1 = require("../prisma/client");
// Mock Prisma
jest.mock('../prisma/client', () => ({
    prisma: {
        user: {
            update: jest.fn(),
        },
    },
}));
describe('Reputation Promotion Logic', () => {
    let mockRequest;
    let mockResponse;
    let jsonMock;
    beforeEach(() => {
        jsonMock = jest.fn();
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jsonMock,
        };
        client_1.prisma.user.update.mockClear();
    });
    it('should promote user to EXPERT when reputation reaches 10', async () => {
        mockRequest = {
            body: {
                userId: 1,
                delta: 1,
                reason: 'Test promotion',
            },
        };
        // Mock first update (increment reputation) returning a user with reputation 10
        client_1.prisma.user.update
            .mockResolvedValueOnce({
            id: 1,
            reputation: 10,
            role: 'USER',
        })
            // Mock second update (promote to expert)
            .mockResolvedValueOnce({
            id: 1,
            reputation: 10,
            role: 'EXPERT',
        });
        await (0, internalController_1.updateReputation)(mockRequest, mockResponse);
        // Expect two update calls
        expect(client_1.prisma.user.update).toHaveBeenCalledTimes(2);
        // First call: increment reputation
        expect(client_1.prisma.user.update).toHaveBeenNthCalledWith(1, {
            where: { id: 1 },
            data: { reputation: { increment: 1 } },
        });
        // Second call: update role to EXPERT
        expect(client_1.prisma.user.update).toHaveBeenNthCalledWith(2, {
            where: { id: 1 },
            data: { role: 'EXPERT' },
        });
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
            status: 'success',
            newReputation: 10
        }));
    });
    it('should NOT promote user if reputation < 10', async () => {
        mockRequest = {
            body: {
                userId: 1,
                delta: 1,
                reason: 'Test no promotion',
            },
        };
        // Mock first update returning reputation 9
        client_1.prisma.user.update.mockResolvedValueOnce({
            id: 1,
            reputation: 9,
            role: 'USER',
        });
        await (0, internalController_1.updateReputation)(mockRequest, mockResponse);
        // Expect only one update call
        expect(client_1.prisma.user.update).toHaveBeenCalledTimes(1);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
            status: 'success',
            newReputation: 9
        }));
    });
});
