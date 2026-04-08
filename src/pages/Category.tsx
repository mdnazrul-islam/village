import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ref, onValue, query, orderByChild, equalTo } from "firebase/database";
import { db } from "@/lib/firebase";
import { Post } from "@/types";
import NewsCard from "@/components/common/NewsCard";
import Sidebar from "@/components/common/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function Category() {
  const { name } = useParams<{ name: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!name) return;
    setLoading(true);

    const postsRef = query(
      ref(db, "posts"),
      orderByChild("category"),
      equalTo(name)
    );

    const unsubscribe = onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data)
          .map(([id, val]: [string, any]) => ({ id, ...val }))
          .reverse();
        setPosts(list);
      } else {
        setPosts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [name]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="border-b-2 border-slate-100 pb-2">
          <h1 className="text-3xl font-bold font-bangla border-l-4 border-red-600 pl-3">বিভাগ: {name}</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-[300px] w-full rounded-xl" />)}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map(post => (
              <NewsCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 font-bangla text-xl text-slate-500">
            এই বিভাগে কোনো সংবাদ পাওয়া যায়নি।
          </div>
        )}
      </div>

      <Sidebar />
    </div>
  );
}
