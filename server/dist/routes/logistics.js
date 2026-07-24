"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logisticsRouter = void 0;
const express_1 = require("express");
exports.logisticsRouter = (0, express_1.Router)();
const mockDeliveries = [
    {
        id: 'del-8801',
        orderNumber: 'AGR-ORD-99120',
        pickupLocation: 'Funtua Depot, Katsina State',
        dropoffLocation: 'Mile 12 Market, Lagos',
        cargo: '200 Bags White Maize',
        status: 'in_transit',
        partnerName: 'Kwik Agri-Logistics',
        driverName: 'Ibrahim Musa',
        driverPhone: '+234 803 112 4499',
        vehicleNumber: 'KST-492-XA (20 Ton Cold-Trailer)',
        estimatedArrival: '2026-07-25T16:00:00Z',
        lat: 9.0765,
        lng: 7.3986
    },
    {
        id: 'del-8802',
        orderNumber: 'AGR-ORD-99125',
        pickupLocation: 'Jos Produce Hub, Plateau',
        dropoffLocation: 'Eko Hotel Central Kitchen, Lagos',
        cargo: '2 Tons Fresh Tomatoes',
        status: 'assigned',
        partnerName: 'GIG Logistics Express',
        driverName: 'Emmanuel Okafor',
        driverPhone: '+234 802 884 9911',
        vehicleNumber: 'JOS-110-PL (Refrigerated Truck)',
        estimatedArrival: '2026-07-26T10:00:00Z',
        lat: 9.8965,
        lng: 8.8583
    }
];
exports.logisticsRouter.get('/', (req, res) => {
    res.json({ success: true, data: mockDeliveries });
});
exports.logisticsRouter.post('/calculate-fee', (req, res) => {
    const { originState, destinationState, weightTons, isColdChain } = req.body;
    const baseRatePerTon = originState === destinationState ? 25000 : 85000;
    const weight = Number(weightTons || 1);
    const coldChainMultiplier = isColdChain ? 1.35 : 1.0;
    const estimatedFee = Math.round(baseRatePerTon * weight * coldChainMultiplier);
    res.json({
        success: true,
        data: {
            originState,
            destinationState,
            weightTons: weight,
            estimatedFee,
            estimatedHours: originState === destinationState ? 6 : 24,
            carrierPartners: ['GIG Logistics', 'Kwik Delivery', 'DHL Freight']
        }
    });
});
