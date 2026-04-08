import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ref, onValue, update, query, limitToLast } from "firebase/database";
import { db } from "@/lib/firebase";
import { Post } from "@/types";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { Clock, Eye, Share2, Facebook, Twitter, MessageCircle, Link as LinkIcon } from "lucide-react";
import Sidebar from "@/components/common/Sidebar";
import NewsCard from "@/components/common/NewsCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const postRef = ref(db, `posts/${id}`);
    const unsubscribe = onValue(postRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPost({ id, ...data });
        
        // Increment views (once per session ideally, but simple for now)
        update(postRef, { views: (data.views || 0) + 1 });

        // Fetch related posts
        const relatedRef = query(ref(db, "posts"), limitToLast(10));
        onValue(relatedRef, (relSnapshot) => {
          const relData = relSnapshot.val();
          if (relData) {
            const list = Object.entries(relData)
              .map(([rid, val]: [string, any]) => ({ id: rid, ...val }))
              .filter(p => p.id !== id && p.category === data.category)
              .slice(0, 3);
            setRelatedPosts(list);
          }
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("লিংক কপি করা হয়েছে!");
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (!post) return <div className="text-center py-20 font-bangla text-2xl">দুঃখিত, সংবাদটি পাওয়া যায়নি।</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded font-bangla uppercase">
              {post.category}
            </span>
            <span className="text-slate-400 text-sm font-bangla">
              {format(new Date(post.timestamp), "d MMMM yyyy, h:mm a", { locale: bn })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-bangla leading-tight text-slate-900">
            {post.title}
          </h1>
          <div className="flex items-center justify-between border-y py-3 text-slate-500 text-sm font-bangla">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Clock size={16} /> {format(new Date(post.timestamp), "p", { locale: bn })}</span>
              <span className="flex items-center gap-1"><Eye size={16} /> {post.views} বার পড়া হয়েছে</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-blue-600 hover:bg-blue-50" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`)}>
                <Facebook size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-sky-500 hover:bg-sky-50" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`)}>
                <Twitter size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-green-500 hover:bg-green-50" onClick={() => window.open(`https://wa.me/?text=${window.location.href}`)}>
                <MessageCircle size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-100" onClick={copyLink}>
                <LinkIcon size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img
            src={post.image || "https://picsum.photos/seed/article/1200/800"}
            alt={post.title}
            className="w-full h-auto object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Article Content */}
        <div 
          className="prose prose-slate max-w-none font-bangla text-lg leading-relaxed text-slate-800"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share Bottom */}
        <div className="bg-slate-50 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-bold font-bangla text-slate-700 flex items-center gap-2">
            <Share2 size={20} className="text-red-600" /> এই সংবাদটি শেয়ার করুন:
          </span>
          <div className="flex items-center gap-3">
            <Button className="bg-[#1877F2] hover:bg-[#1877F2]/90 gap-2 font-bangla" onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`)}>
              <Facebook size={18} /> ফেসবুক
            </Button>
            <Button className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 gap-2 font-bangla" onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}`)}>
              <Twitter size={18} /> টুইটার
            </Button>
            <Button className="bg-[#25D366] hover:bg-[#25D366]/90 gap-2 font-bangla" onClick={() => window.open(`https://wa.me/?text=${window.location.href}`)}>
              <MessageCircle size={18} /> হোয়াটসঅ্যাপ
            </Button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-2xl font-bold font-bangla border-l-4 border-red-600 pl-3">আরও পড়ুন</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(relPost => (
                <NewsCard key={relPost.id} post={relPost} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sidebar */}
      <Sidebar />
    </div>
  );
}
