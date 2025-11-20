"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReputation = void 0;
const client_1 = require("../prisma/client");
const updateReputation = async (req, res) => {
    const { userId, delta, reason } = req.body;
    if (typeof userId !== "number" || typeof delta !== "number") {
        return res.status(400).json({ error: "Invalid payload" });
    }
    try {
        const user = await client_1.prisma.user.update({
            where: { id: userId },
            data: {
                reputation: { increment: delta },
            },
        });
        // Logic for role promotion based on reputation
        if (user.reputation >= 10 && user.role === "USER") {
            await client_1.prisma.user.update({
                where: { id: userId },
                data: { role: "EXPERT" },
            });
        }
        console.log(`[AuthService] Reputation updated for user ${userId}: ${delta} (${reason})`);
        return res.json({ status: "success", newReputation: user.reputation });
    }
    catch (error) {
        console.error("Reputation update failed:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.updateReputation = updateReputation;
