import { updateReputation } from '../controllers/internalController';
import { prisma } from '../prisma/client';
import { Request, Response } from 'express';

// Mock Prisma
jest.mock('../prisma/client', () => ({
  prisma: {
    user: {
      update: jest.fn(),
    },
  },
}));

describe('Reputation Promotion Logic', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jsonMock,
    } as unknown as Response;
    (prisma.user.update as jest.Mock).mockClear();
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
    (prisma.user.update as jest.Mock)
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

    await updateReputation(mockRequest as Request, mockResponse as Response);

    // Expect two update calls
    expect(prisma.user.update).toHaveBeenCalledTimes(2);

    // First call: increment reputation
    expect(prisma.user.update).toHaveBeenNthCalledWith(1, {
      where: { id: 1 },
      data: { reputation: { increment: 1 } },
    });

    // Second call: update role to EXPERT
    expect(prisma.user.update).toHaveBeenNthCalledWith(2, {
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
    (prisma.user.update as jest.Mock).mockResolvedValueOnce({
      id: 1,
      reputation: 9,
      role: 'USER',
    });

    await updateReputation(mockRequest as Request, mockResponse as Response);

    // Expect only one update call
    expect(prisma.user.update).toHaveBeenCalledTimes(1);
    expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
      status: 'success',
      newReputation: 9
    }));
  });
});

