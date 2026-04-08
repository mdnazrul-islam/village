import { useState, useEffect } from "react";
import { ref, onValue, query, limitToLast } from "firebase/database";
import { db } from "@/lib/firebase";
import { Post } from "@/types";
import { Link } from "react-router-dom";

export default function BreakingNews() {
  const [news, setNews] = useState<Post[]>([]);

  useEffect(() => {
    const newsRef = query(ref(db, "posts"), limitToLast(5));
    const unsubscribe = onValue(newsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const newsList = Object.entries(data)
          .map(([id, val]: [string, any]) => ({ id, ...val }))
          .filter(post => post.breaking)
          .reverse();
        setNews(newsList);
      }
    });

    return () => unsubscribe();
  }, []);

  if (news.length === 0) return null;

  return (
    <div className="bg-red-600 text-white overflow-hidden">
      <div className="container mx-auto px-4 flex items-center">
        <div className="bg-slate-900 px-4 py-2 font-bold whitespace-nowrap z-10 font-bangla">
          ব্রেকিং নিউজ:
        </div>
        <div className="flex-grow overflow-hidden relative h-10">
          <div className="absolute whitespace-nowrap animate-marquee flex items-center h-full">
            {news.map((item) => (
              <Link
                key={item.id}
                to={`/article/${item.id}`}
                className="mx-8 hover:underline font-bangla"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
