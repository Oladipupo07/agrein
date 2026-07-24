import React from 'react';
import { BookOpen, Video, FileText, Award, PlayCircle, Sprout } from 'lucide-react';

export const LearningCenter: React.FC = () => {
  const articles = [
    {
      title: 'Modern Pest Management: Controlling Fall Armyworm Without Chemical Overuse',
      category: 'Pest Management',
      readTime: '6 min read',
      author: 'Dr. Aliyu Bello',
      image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Step-by-Step Guide to Phytosanitary Export Certification for Nigerian Sesame & Cocoa',
      category: 'Export & Trade',
      readTime: '10 min read',
      author: 'Agrein Export Advisory Team',
      image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'Drip Irrigation Setup for High-Yield Tomato Farming in Dry Season Plateau',
      category: 'Irrigation & Soil',
      readTime: '8 min read',
      author: 'Engr. Grace Pam',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800',
    }
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="glass-panel p-8 rounded-3xl border border-agrein-500/20 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-agrein-400 bg-agrein-500/10 px-3 py-1 rounded-full border border-agrein-500/20">
            Agronomy Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Agri-Learning <span className="gradient-text">Center</span>
          </h1>
          <p className="text-gray-300 text-sm">
            Master modern farming techniques, pest control, export procedures, and soil management with expert guides.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art, idx) => (
          <div key={idx} className="glass-panel rounded-3xl overflow-hidden border border-agrein-500/20 flex flex-col group hover:border-agrein-500/50 transition-all">
            <div className="h-48 overflow-hidden bg-gray-900">
              <img src={art.image} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="px-2.5 py-1 rounded-full bg-agrein-500/10 text-agrein-400 text-[11px] font-bold border border-agrein-500/20">
                  {art.category}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-agrein-400 transition-colors">{art.title}</h3>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-800">
                <span>By {art.author}</span>
                <span>{art.readTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
