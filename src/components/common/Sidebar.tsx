import React, { useState, useEffect } from "react";
import { ref, onValue, query, orderByChild, limitToLast } from "firebase/database";
import { db } from "@/lib/firebase";
import { Post } from "@/types";
import NewsCard from "./NewsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Sidebar() {
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Latest Posts
    const latestRef = query(ref(db, "posts"), limitToLast(5));
    onValue(latestRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data)
          .map(([id, val]: [string, any]): Post => ({ id, ...val } as Post))
          .reverse();
        setLatestPosts(list);
      }
    });

    // Popular Posts (simulated with views)
    const popularRef = query(ref(db, "posts"), limitToLast(10));
    onValue(popularRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data)
          .map(([id, val]: [string, any]): Post => ({ id, ...val } as Post))
          .sort((a, b) => b.views - a.views)
          .slice(0, 5);
        setPopularPosts(list);
      }
    });
  }, []);

  return (
    <aside className="space-y-8">
      {/* Tabs for Latest/Popular */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <Tabs defaultValue="latest" className="w-full">
          <TabsList className="w-full grid grid-cols-2 mb-4">
            <TabsTrigger value="latest" className="font-bangla">সর্বশেষ</TabsTrigger>
            <TabsTrigger value="popular" className="font-bangla">জনপ্রিয়</TabsTrigger>
          </TabsList>
          <TabsContent value="latest" className="space-y-4">
            {latestPosts.map(post => (
              <NewsCard key={post.id} post={post} variant="compact" />
            ))}
          </TabsContent>
          <TabsContent value="popular" className="space-y-4">
            {popularPosts.map(post => (
              <NewsCard key={post.id} post={post} variant="compact" />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Advertisement Placeholder */}
      <div className="bg-slate-200 aspect-[3/4] rounded-xl flex items-center justify-center text-slate-400 font-bold">
        ADVERTISEMENT
      </div>

      {/* Video Section Placeholder */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold font-bangla border-l-4 border-red-600 pl-3">ভিডিও সংবাদ</h3>
        <div className="bg-slate-900 aspect-video rounded-xl overflow-hidden relative group cursor-pointer">
          <img 
            src="https://picsum.photos/seed/video/400/225" 
            alt="Video" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
              <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
