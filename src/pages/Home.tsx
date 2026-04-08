import { useState, useEffect } from "react";
import { ref, onValue, query, limitToLast } from "firebase/database";
import { db } from "@/lib/firebase";
import { Post } from "@/types";
import NewsCard from "@/components/common/NewsCard";
import Sidebar from "@/components/common/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postsRef = query(ref(db, "posts"), limitToLast(20));
    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data)
          .map(([id, val]: [string, any]) => ({ id, ...val }))
          .reverse();
        setPosts(list);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const featuredPosts = posts.filter(p => p.featured).slice(0, 5);
  const latestPosts = posts.slice(0, 10);
  
  const categories = ["জাতীয়", "আন্তর্জাতিক", "খেলাধুলা", "বিনোদন"];

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-[300px] w-full rounded-xl" />)}
          </div>
        </div>
        <div className="space-y-8">
          <Skeleton className="h-[500px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-12">
        {/* Hero Section */}
        {featuredPosts.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Featured */}
            <div className="md:col-span-1">
              <NewsCard post={featuredPosts[0]} />
            </div>
            {/* Secondary Featured */}
            <div className="grid grid-cols-1 gap-4">
              {featuredPosts.slice(1, 3).map(post => (
                <NewsCard key={post.id} post={post} variant="horizontal" />
              ))}
            </div>
          </section>
        )}

        {/* Latest News Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2">
            <h2 className="text-2xl font-bold font-bangla border-l-4 border-red-600 pl-3">সর্বশেষ সংবাদ</h2>
            <Link to="/category/সর্বশেষ" className="text-red-600 flex items-center gap-1 font-bangla text-sm hover:underline">
              সব দেখুন <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestPosts.map(post => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        {/* Category-wise Sections */}
        {categories.map(cat => {
          const catPosts = posts.filter(p => p.category === cat).slice(0, 4);
          if (catPosts.length === 0) return null;
          
          return (
            <section key={cat} className="space-y-6">
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-2">
                <h2 className="text-2xl font-bold font-bangla border-l-4 border-red-600 pl-3">{cat}</h2>
                <Link to={`/category/${cat}`} className="text-red-600 flex items-center gap-1 font-bangla text-sm hover:underline">
                  সব দেখুন <ChevronRight size={16} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-1">
                  <NewsCard post={catPosts[0]} />
                </div>
                <div className="space-y-4">
                  {catPosts.slice(1).map(post => (
                    <NewsCard key={post.id} post={post} variant="horizontal" />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Sidebar */}
      <Sidebar />
    </div>
  );
}
