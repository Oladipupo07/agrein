"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cooperativesRouter = void 0;
const express_1 = require("express");
exports.cooperativesRouter = (0, express_1.Router)();
const mockCooperatives = [
    {
        id: 'coop-001',
        name: 'Arewa Grain Producers Cooperative Society',
        registrationNumber: 'FMA/COOP/2021/8841',
        state: 'Kano',
        membersCount: 450,
        leaderName: 'Alhaji Sanusi Garba',
        sharedStockTons: 1200,
        description: 'Specialized in large-scale pooled aggregation of Maize, Sorghum, and Soybeans.',
    },
    {
        id: 'coop-002',
        name: 'Plateau Cold-Chain Vegetable Growers',
        registrationNumber: 'FMA/COOP/2023/1109',
        state: 'Plateau',
        membersCount: 180,
        leaderName: 'Grace Pam',
        sharedStockTons: 350,
        description: 'Providing temperature-controlled logistics for tomatoes, peppers, and leafy greens.',
    }
];
exports.cooperativesRouter.get('/', (req, res) => {
    res.json({ success: true, data: mockCooperatives });
});
