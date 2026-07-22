import React, { useState, useEffect } from 'react';
import { forumService } from '../services/api';
import { MessageSquare, ThumbsUp, Eye, Pin, Search, Plus, ChevronRight, TrendingUp, Users, Clock, Tag, Flame, Sprout, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const FALLBACK_THREADS = [
  {
    id: '1', title: 'Best time to plant maize in Benue State? Looking for 2026 advice', category: 'Crop Planning',
    author: 'Emeka Nnaji', avatar: 'EN', replies: 28, views: 1240, likes: 47, pinned: true,
    tags: ['Maize', 'Benue', 'Planting Season'], timeAgo: '2 hours ago', solved: true,
  },
  {
    id: '2', title: 'How I increased my tomato yield by 60% using drip irrigation – Step-by-step guide', category: 'Success Story',
    author: 'Amaka Okonkwo', avatar: 'AO', replies: 54, views: 5830, likes: 213, pinned: true,
    tags: ['Tomatoes', 'Irrigation', 'Yield Boost'], timeAgo: '1 day ago', solved: false,
  },
  {
    id: '3', title: 'Cocoa prices are dropping – is it worth holding stock until Q4?', category: 'Market Talk',
    author: 'Tunde Balogun', avatar: 'TB', replies: 19, views: 876, likes: 34, pinned: false,
    tags: ['Cocoa', 'Prices', 'Market Strategy'], timeAgo: '3 hours ago', solved: false,
  },
  {
    id: '4', title: 'Fall Armyworm outbreak in Kano – what\'s working for pest control?', category: 'Pest & Disease',
    author: 'Ibrahim Sule', avatar: 'IS', replies: 42, views: 3120, likes: 98, pinned: false,
    tags: ['Pest Control', 'Maize', 'Kano'], timeAgo: '5 hours ago', solved: true,
  },
  {
    id: '5', title: 'Looking for reliable logistics partners for Ogun to Lagos cold chain', category: 'Logistics',
    author: 'Bisi Adeleke', avatar: 'BA', replies: 11, views: 420, likes: 18, pinned: false,
    tags: ['Logistics', 'Cold Chain', 'Ogun'], timeAgo: '1 day ago', solved: false,
  },
  {
    id: '6', title: 'Agrein RFQ system worked great for my yam bulkorder – sharing my experience', category: 'Platform Tips',
    author: 'Chioma Nwachukwu', avatar: 'CN', replies: 7, views: 210, likes: 31, pinned: false,
    tags: ['RFQ', 'Yam', 'Bulk Order'], timeAgo: '2 days ago', solved: false,
  },
];

const CATEGORIES = ['All', 'Crop Planning', 'Market Talk', 'Success Story', 'Pest & Disease', 'Logistics', 'Platform Tips'];
const CATEGORY_COLORS: Record<string, string> = {
  'Crop Planning': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  'Market Talk': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'Success Story': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Pest & Disease': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Logistics': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  'Platform Tips': 'bg-teal-500/20 text-teal-300 border-teal-500/30',
};

const AvatarColors = ['bg-emerald-600', 'bg-blue-600', 'bg-violet-600', 'bg-amber-600', 'bg-red-600', 'bg-teal-600'];

export const CommunityForumPage: React.FC = () => {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [showNewPost, setShowNewPost] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await forumService.getThreads();
        setThreads(data?.length ? data : FALLBACK_THREADS);
      } catch {
        setThreads(FALLBACK_THREADS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = threads.filter(t => {
    const matchQ = t.title.toLowerCase().includes(query.toLowerCase()) || t.tags.some((tag: string) => tag.toLowerCase().includes(query.toLowerCase()));
    const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
    return matchQ && matchCat;
  });

  const handleLike = (id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleNewPost = () => {
    if (!newTitle.trim()) { toast.error('Please enter a title'); return; }
    const newThread = {
      id: String(Date.now()), title: newTitle, category: 'Crop Planning',
      author: 'You', avatar: 'YO', replies: 0, views: 1, likes: 0, pinned: false,
      tags: ['General'], timeAgo: 'just now', solved: false,
    };
    setThreads(prev => [newThread, ...prev]);
    setNewTitle('');
    setShowNewPost(false);
    toast.success('Your post has been published!');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-emerald-950 p-8 rounded-3xl border border-teal-800/50 shadow-2xl relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 border border-teal-500/30">
                <Users className="w-4 h-4 text-teal-400" />
                <span>Agrein Farmer Community</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Community Forum</h1>
              <p className="text-sm text-slate-300 mt-2 max-w-xl">
                Connect with 50,000+ farmers, share knowledge, ask questions, and grow together across Nigeria and Africa.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              {[
                { label: 'Members', value: '52,340' },
                { label: 'Threads', value: '8,900+' },
                { label: 'Online Now', value: '1,247' },
              ].map(s => (
                <div key={s.label} className="bg-slate-800/70 rounded-2xl px-5 py-3 text-center border border-slate-700">
                  <p className="text-xl font-extrabold text-teal-400">{s.value}</p>
                  <p className="text-xs text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* New Post + Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search discussions, tags..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button
            onClick={() => setShowNewPost(!showNewPost)}
            className="bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" /> New Discussion
          </button>
        </div>

        {/* New Post Form */}
        {showNewPost && (
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-teal-700/50 space-y-3 shadow-xl">
            <h3 className="font-bold text-white">Start a New Discussion</h3>
            <input
              type="text"
              placeholder="Enter your discussion title..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <div className="flex gap-3">
              <button onClick={handleNewPost} className="bg-teal-600 hover:bg-teal-500 text-white px-5 py-2 rounded-xl font-bold text-sm">
                Publish Post
              </button>
              <button onClick={() => setShowNewPost(false)} className="text-slate-400 hover:text-white px-5 py-2 rounded-xl font-bold text-sm bg-slate-700 hover:bg-slate-600">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-teal-600 text-white shadow' : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Pinned threads */}
        {filtered.filter(t => t.pinned).length > 0 && selectedCategory === 'All' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <Pin className="w-3.5 h-3.5" /> Pinned Discussions
            </div>
            {filtered.filter(t => t.pinned).map((thread, idx) => (
              <ThreadCard key={thread.id} thread={thread} idx={idx} likedIds={likedIds} onLike={handleLike} />
            ))}
          </div>
        )}

        {/* All threads */}
        <div className="space-y-3">
          {filtered.filter(t => selectedCategory !== 'All' || !t.pinned).map((thread, idx) => (
            <ThreadCard key={thread.id} thread={thread} idx={idx} likedIds={likedIds} onLike={handleLike} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-bold">No discussions found</p>
              <p className="text-sm mt-1">Be the first to start this conversation!</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

const ThreadCard: React.FC<{ thread: any; idx: number; likedIds: Set<string>; onLike: (id: string) => void }> = ({ thread, idx, likedIds, onLike }) => {
  const liked = likedIds.has(thread.id);

  return (
    <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 shadow-xl hover:border-teal-600/40 transition-all group cursor-pointer">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`w-10 h-10 rounded-full ${AvatarColors[idx % AvatarColors.length]} flex items-center justify-center text-xs font-extrabold text-white shrink-0`}>
          {thread.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {thread.pinned && <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                {thread.solved && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">✓ Solved</span>}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[thread.category] || 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                  {thread.category}
                </span>
              </div>
              <h3 className="font-bold text-white text-sm leading-snug group-hover:text-teal-300 transition-colors line-clamp-2">
                {thread.title}
              </h3>
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                <span>by <span className="text-slate-300 font-medium">{thread.author}</span></span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{thread.timeAgo}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {thread.tags.map((tag: string) => (
                  <span key={tag} className="flex items-center gap-1 text-[10px] bg-slate-700 text-slate-400 px-2 py-0.5 rounded-full">
                    <Tag className="w-2.5 h-2.5" />{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-col items-end gap-2 shrink-0 text-xs text-slate-400">
          <button
            onClick={e => { e.stopPropagation(); onLike(thread.id); }}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${liked ? 'text-red-400 bg-red-500/10' : 'hover:text-red-400 hover:bg-red-500/10'}`}
          >
            <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
            {thread.likes + (liked ? 1 : 0)}
          </button>
          <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{thread.replies}</span>
          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{thread.views.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
