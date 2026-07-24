"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.communityRouter = void 0;
const express_1 = require("express");
exports.communityRouter = (0, express_1.Router)();
const mockPosts = [
    {
        id: 'post-101',
        author: 'Dr. Aliyu Bello (Agronomist)',
        role: 'Expert',
        title: 'Best Practices for Managing Fall Armyworm in Wet Season Maize',
        category: 'Pest Control',
        content: 'With heavy rain spells expected in North Central Nigeria, early scouting for Armyworm larvae is crucial. Spraying should be done early morning or late evening when caterpillars are active.',
        upvotes: 42,
        commentsCount: 9,
        createdAt: '2026-07-22T08:30:00Z',
    },
    {
        id: 'post-102',
        author: 'Kano Maize Farmers Union',
        role: 'Cooperative',
        title: 'Direct Export Opportunity: 500 Tons White Maize Needed for Cotonou Port',
        category: 'Market Trends',
        content: 'We are pooling maize volume from members for a verified international buyer payout via Interswitch Escrow. Reach out if you have minimum 10 bags ready.',
        upvotes: 89,
        commentsCount: 23,
        createdAt: '2026-07-23T14:10:00Z',
    }
];
exports.communityRouter.get('/posts', (req, res) => {
    res.json({ success: true, data: mockPosts });
});
exports.communityRouter.post('/posts', (req, res) => {
    const { title, content, category, author } = req.body;
    const newPost = {
        id: `post-${Date.now()}`,
        author: author || 'Agrein Community Member',
        role: 'Farmer',
        title,
        content,
        category: category || 'General Discussion',
        upvotes: 1,
        commentsCount: 0,
        createdAt: new Date().toISOString(),
    };
    mockPosts.unshift(newPost);
    res.json({ success: true, data: newPost });
});
