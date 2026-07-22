import React, { useState, useEffect } from 'react';
import { learningService } from '../services/api';
import { BookOpen, Play, Clock, Award, ChevronRight, Star, Users, Search, Filter, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const FALLBACK_COURSES = [
  {
    id: '1', title: 'Modern Irrigation Techniques for Small Farms', category: 'Water Management',
    instructor: 'Dr. Amaka Obi', duration: '4h 20m', level: 'Beginner', rating: 4.9,
    students: 2340, lessons: 18, free: true,
    thumbnail: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=220&fit=crop',
    progress: 65,
  },
  {
    id: '2', title: 'AI-Powered Crop Disease Detection using Mobile Phones', category: 'AgriTech',
    instructor: 'Eng. Chuka Nwaneri', duration: '6h 10m', level: 'Intermediate', rating: 4.8,
    students: 1892, lessons: 24, free: false,
    thumbnail: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=220&fit=crop',
    progress: 0,
  },
  {
    id: '3', title: 'Export-Ready Agriculture: Meeting EU & US Quality Standards', category: 'Export',
    instructor: 'Fatima Al-Hassan', duration: '5h 45m', level: 'Advanced', rating: 4.7,
    students: 876, lessons: 21, free: false,
    thumbnail: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&h=220&fit=crop',
    progress: 30,
  },
  {
    id: '4', title: 'Cooperative Formation & Collective Bargaining for Farmers', category: 'Business',
    instructor: 'Seun Adeleke', duration: '3h 30m', level: 'Beginner', rating: 4.6,
    students: 3210, lessons: 14, free: true,
    thumbnail: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=220&fit=crop',
    progress: 100,
  },
  {
    id: '5', title: 'Organic Fertilizer Production from Farm Waste', category: 'Sustainability',
    instructor: 'Dr. Kemi Adesanya', duration: '3h 15m', level: 'Beginner', rating: 4.8,
    students: 4512, lessons: 16, free: true,
    thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=220&fit=crop',
    progress: 0,
  },
  {
    id: '6', title: 'Financial Management & Loan Access for Smallholder Farmers', category: 'Finance',
    instructor: 'Adaeze Eze', duration: '4h 50m', level: 'Intermediate', rating: 4.9,
    students: 1678, lessons: 20, free: false,
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=220&fit=crop',
    progress: 0,
  },
];

const CATEGORIES = ['All', 'Water Management', 'AgriTech', 'Export', 'Business', 'Sustainability', 'Finance'];
const LEVEL_COLORS: Record<string, string> = {
  Beginner: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Intermediate: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Advanced: 'bg-red-500/20 text-red-300 border-red-500/30',
};

export const LearningCenterPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await learningService.getCourses();
        setCourses(data?.length ? data : FALLBACK_COURSES);
      } catch {
        setCourses(FALLBACK_COURSES);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = courses.filter(c => {
    const matchQuery = c.title.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase());
    const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
    return matchQuery && matchCat;
  });

  const completedCount = courses.filter(c => c.progress === 100).length;
  const inProgressCount = courses.filter(c => c.progress > 0 && c.progress < 100).length;

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-8 rounded-3xl border border-blue-800/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -translate-y-20 translate-x-20" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-blue-500/30">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Agrein Learning Center</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">AgriFarm Academy</h1>
              <p className="text-sm text-slate-300 mt-2 max-w-xl">
                Expert-led courses on modern farming, agri-business, export compliance, and technology — all tailored for African farmers.
              </p>
            </div>

            {/* Progress Summary */}
            <div className="flex gap-4 flex-wrap">
              {[
                { label: 'Completed', value: completedCount, color: 'text-emerald-400' },
                { label: 'In Progress', value: inProgressCount, color: 'text-amber-400' },
                { label: 'Available', value: courses.length, color: 'text-blue-400' },
              ].map(s => (
                <div key={s.label} className="bg-slate-800/60 rounded-2xl px-5 py-3 text-center border border-slate-700">
                  <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search courses, topics..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <div key={course.id} className="bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700 shadow-xl flex flex-col group hover:border-blue-500/50 transition-colors">
              <div className="relative overflow-hidden h-40">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${LEVEL_COLORS[course.level]}`}>
                    {course.level}
                  </span>
                </div>
                {course.free ? (
                  <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-full">FREE</span>
                ) : (
                  <span className="absolute top-3 right-3 bg-amber-500 text-black text-[10px] font-extrabold px-2 py-1 rounded-full flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> PRO
                  </span>
                )}
                {course.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-700">
                    <div
                      className={`h-full transition-all ${course.progress === 100 ? 'bg-emerald-400' : 'bg-blue-400'}`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">{course.category}</span>
                <h3 className="font-bold text-white mt-1 text-sm leading-snug line-clamp-2">{course.title}</h3>
                <p className="text-xs text-slate-400 mt-1">by {course.instructor}</p>

                <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-500" />{course.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-slate-500" />{course.lessons} lessons</span>
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-500" />{course.students.toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-1 mt-2 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(course.rating) ? 'text-amber-400' : 'text-slate-600'} fill-current`} />
                  ))}
                  <span className="text-xs text-slate-400 ml-1">{course.rating}</span>
                </div>

                <button
                  onClick={() => {
                    if (!course.free) {
                      toast.success('Upgrade to Pro to access this course!');
                    } else {
                      toast.success(`Starting: ${course.title}`);
                    }
                  }}
                  className={`mt-auto w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                    ${course.progress === 100
                      ? 'bg-emerald-600/30 text-emerald-400 border border-emerald-600/50 cursor-default'
                      : course.free
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow hover:shadow-blue-500/20'
                        : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'}`}
                >
                  {course.progress === 100 ? (
                    <><CheckCircle2 className="w-4 h-4" /> Completed</>
                  ) : course.progress > 0 ? (
                    <><Play className="w-4 h-4" /> Continue ({course.progress}%)</>
                  ) : course.free ? (
                    <><Play className="w-4 h-4" /> Start Course</>
                  ) : (
                    <><Lock className="w-4 h-4" /> Unlock with Pro</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Certificate Banner */}
        <div className="bg-gradient-to-r from-amber-500/20 via-emerald-500/10 to-blue-500/20 border border-amber-500/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6">
          <Award className="w-14 h-14 text-amber-400 shrink-0" />
          <div>
            <h3 className="text-lg font-bold text-white">Earn Your AgriFarm Certificate</h3>
            <p className="text-sm text-slate-300 mt-1">
              Complete any course to receive a verifiable certificate recognized by Nigerian agricultural boards and international export agencies.
            </p>
          </div>
          <button
            onClick={() => toast.success('Certification programs coming soon!')}
            className="bg-amber-500 hover:bg-amber-400 text-black px-5 py-2.5 rounded-xl font-bold text-sm shrink-0 flex items-center gap-2"
          >
            <Award className="w-4 h-4" /> View Certificates
          </button>
        </div>

      </div>
    </div>
  );
};
