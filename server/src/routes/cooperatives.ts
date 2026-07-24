import { Router, Request, Response } from 'express';

export const cooperativesRouter = Router();

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

cooperativesRouter.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: mockCooperatives });
});
