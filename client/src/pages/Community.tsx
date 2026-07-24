import React, { useEffect, useState } from 'react';
import { Users, ThumbsUp, MessageSquare, Plus, Send } from 'lucide-react';
import { fetchForumPosts } from '../services/api';
import { ForumPost } from '../types';

export const Community: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForumPosts().then(res => {
      if (res.data) setPosts(res.data);
    }).catch(err => console.error(err)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-10 pb-20">
      <div className="glass-panel p-8 rounded-3xl border border-agrein-500/20 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <span className="text-xs font-bold uppercase tracking-wider text-agrein-400 bg-agrein-500/10 px-3 py-1 rounded-full border border-agrein-500/20">
            Agricultural Social Forum
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Farmers & Buyers <span className="gradient-text">Community Network</span>
          </h1>
          <p className="text-gray-300 text-sm">
            Ask questions, share harvest insights, negotiate bulk aggregation deals, and network with certified agronomists.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-agrein-400 animate-pulse">Loading community discussions...</div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto">
          {posts.map((post) => (
            <div key={post.id} className="glass-panel p-6 rounded-3xl border border-agrein-500/20 space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="font-bold text-white flex items-center gap-1.5">
                  {post.author} <span className="px-2 py-0.5 rounded-full bg-agrein-500/10 text-agrein-400 text-[10px] font-semibold">{post.role}</span>
                </span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>

              <h3 className="text-lg font-bold text-white">{post.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{post.content}</p>

              <div className="flex items-center gap-4 pt-3 border-t border-gray-800 text-xs text-gray-400">
                <button className="flex items-center gap-1.5 hover:text-agrein-400">
                  <ThumbsUp className="w-4 h-4 text-agrein-400" /> {post.upvotes} Upvotes
                </button>
                <button className="flex items-center gap-1.5 hover:text-agrein-400">
                  <MessageSquare className="w-4 h-4 text-gray-400" /> {post.commentsCount} Replies
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
