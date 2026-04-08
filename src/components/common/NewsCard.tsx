import React from "react";
import { Link } from "react-router-dom";
import { Post } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { bn } from "date-fns/locale";
import { Clock, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  post: Post;
  variant?: "default" | "horizontal" | "compact";
  key?: string | number;
}

export default function NewsCard({ post, variant = "default" }: NewsCardProps) {
  const timeAgo = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true, locale: bn });

  if (variant === "horizontal") {
    return (
      <Link to={`/article/${post.id}`} className="flex gap-4 group news-card-hover bg-white p-3 rounded-lg">
        <div className="w-1/3 shrink-0 overflow-hidden rounded-md">
          <img
            src={post.image || "https://picsum.photos/seed/news/400/300"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col justify-between py-1">
          <div>
            <span className="text-red-600 text-xs font-bold font-bangla mb-1 block">{post.category}</span>
            <h3 className="text-lg font-bold font-bangla leading-snug group-hover:text-red-600 transition-colors line-clamp-2">
              {post.title}
            </h3>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-xs mt-2">
            <span className="flex items-center gap-1"><Clock size={12} /> {timeAgo}</span>
            <span className="flex items-center gap-1"><Eye size={12} /> {post.views}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link to={`/article/${post.id}`} className="flex gap-3 group border-b border-slate-100 pb-3 last:border-0">
        <div className="w-20 h-20 shrink-0 overflow-hidden rounded">
          <img
            src={post.image || "https://picsum.photos/seed/news/200/200"}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h4 className="text-sm font-bold font-bangla leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
            {post.title}
          </h4>
          <span className="text-[10px] text-slate-400 mt-1 font-bangla">{timeAgo}</span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${post.id}`} className="flex flex-col group news-card-hover bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="aspect-video overflow-hidden relative">
        <img
          src={post.image || "https://picsum.photos/seed/news/600/400"}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded font-bangla uppercase">
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-xl font-bold font-bangla leading-tight group-hover:text-red-600 transition-colors mb-3 line-clamp-2">
          {post.title}
        </h3>
        <p className="text-slate-500 text-sm font-bangla line-clamp-3 mb-4 flex-grow">
          {post.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
        </p>
        <div className="flex items-center justify-between text-slate-400 text-xs border-t pt-3">
          <span className="flex items-center gap-1 font-bangla"><Clock size={14} /> {timeAgo}</span>
          <span className="flex items-center gap-1 font-bangla"><Eye size={14} /> {post.views}</span>
        </div>
      </div>
    </Link>
  );
}
