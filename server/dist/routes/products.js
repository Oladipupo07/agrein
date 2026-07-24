"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRouter = void 0;
const express_1 = require("express");
exports.productsRouter = (0, express_1.Router)();
// Mock high-quality agricultural products catalog
const mockProducts = [
    {
        id: 'prod-001',
        title: 'Grade-A Premium White Maize (Dry Grain)',
        category: 'Grains & Cereals',
        pricePerUnit: 48000,
        unit: 'bag (50kg)',
        availableStock: 250,
        minOrderQuantity: 5,
        farmer: {
            id: 'farm-101',
            farmName: 'GreenPastures Farms Ltd',
            location: 'Kano, Kano State',
            trustScore: 4.9,
            isVerified: true,
        },
        isOrganic: true,
        isBulkAvailable: true,
        harvestDate: '2026-06-15',
        imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=800',
        qrCode: 'AGREIN-TRACE-MAIZE-KN2026-9912',
        traceability: [
            { stage: 'Harvesting', location: 'Funtua Cluster, Kano', date: '2026-06-15', status: 'Passed Moisture Check (12%)' },
            { stage: 'Quality & Grading', location: 'Agrein Processing Depot, Kano', date: '2026-06-18', status: 'Certified Grade-A Aflatoxin Free' },
            { stage: 'Packaging & QR Sealed', location: 'Kano Logistics Hub', date: '2026-06-20', status: 'Stored in Temperature Controlled Silo' }
        ]
    },
    {
        id: 'prod-002',
        title: 'Fresh Farm Tomatoes (Rutu Grade)',
        category: 'Vegetables',
        pricePerUnit: 32000,
        unit: 'basket (25kg)',
        availableStock: 120,
        minOrderQuantity: 2,
        farmer: {
            id: 'farm-102',
            farmName: 'SunRays Agro Cooperative',
            location: 'Jos, Plateau State',
            trustScore: 4.8,
            isVerified: true,
        },
        isOrganic: false,
        isBulkAvailable: true,
        harvestDate: '2026-07-20',
        imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
        qrCode: 'AGREIN-TRACE-TOMATO-JS2026-4421',
        traceability: [
            { stage: 'Harvesting', location: 'Barkin Ladi, Jos', date: '2026-07-20', status: 'Handpicked Early Morning' },
            { stage: 'Cold-Chain Dispatch', location: 'Jos Central Aggregation Point', date: '2026-07-21', status: 'Loaded in Cold-Trailer (8°C)' }
        ]
    },
    {
        id: 'prod-003',
        title: 'Export Quality Raw Cashew Nuts (Nut Count: 190)',
        category: 'Cash Crops',
        pricePerUnit: 1250000,
        unit: 'ton',
        availableStock: 45,
        minOrderQuantity: 1,
        farmer: {
            id: 'farm-103',
            farmName: 'Ogbomoso Export Farmers Association',
            location: 'Ogbomoso, Oyo State',
            trustScore: 5.0,
            isVerified: true,
        },
        isOrganic: true,
        isBulkAvailable: true,
        harvestDate: '2026-05-10',
        imageUrl: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800',
        qrCode: 'AGREIN-TRACE-CASHEW-OY2026-0081',
        traceability: [
            { stage: 'Harvest & Sun Drying', location: 'Ogbomoso Farms', date: '2026-05-10', status: 'KOR 48 lbs / Outturn Tested' },
            { stage: 'Export Packaging', location: 'Lagos Port Terminal Warehouse', date: '2026-06-01', status: 'Jute Bags Stenciled & Phytosanitary Cleared' }
        ]
    },
    {
        id: 'prod-004',
        title: 'Processed Yellow Cassava Flour (HQCF)',
        category: 'Tubers & Processed',
        pricePerUnit: 380000,
        unit: 'ton',
        availableStock: 80,
        minOrderQuantity: 1,
        farmer: {
            id: 'farm-104',
            farmName: 'Benue Agro Processors Alliance',
            location: 'Makurdi, Benue State',
            trustScore: 4.7,
            isVerified: true,
        },
        isOrganic: true,
        isBulkAvailable: true,
        harvestDate: '2026-07-01',
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
        qrCode: 'AGREIN-TRACE-CASSAVA-BN2026-1192',
        traceability: [
            { stage: 'Harvesting', location: 'Gboko, Benue State', date: '2026-07-01', status: 'Starch Content Verified' },
            { stage: 'Flash Drying Processing', location: 'Makurdi Factory', date: '2026-07-03', status: 'Food Grade Micro-Milled' }
        ]
    }
];
exports.productsRouter.get('/', (req, res) => {
    const { category, search, minPrice, maxPrice, organicOnly } = req.query;
    let filtered = [...mockProducts];
    if (category && category !== 'All') {
        filtered = filtered.filter(p => p.category.toLowerCase() === String(category).toLowerCase());
    }
    if (search) {
        const q = String(search).toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.farmer.farmName.toLowerCase().includes(q));
    }
    res.json({
        success: true,
        count: filtered.length,
        data: filtered,
    });
});
exports.productsRouter.get('/:id', (req, res) => {
    const product = mockProducts.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ success: true, data: product });
});
