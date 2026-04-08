import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Layers, Eye, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalCategories: 0,
    trendingPosts: 0
  });

  useEffect(() => {
    const postsRef = ref(db, "posts");
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const posts = Object.values(data) as any[];
        const totalViews = posts.reduce((acc, post) => acc + (post.views || 0), 0);
        const trendingPosts = posts.filter(post => post.trending).length;
        
        setStats(prev => ({
          ...prev,
          totalPosts: posts.length,
          totalViews,
          trendingPosts
        }));
      }
    });

    const catsRef = ref(db, "categories");
    onValue(catsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStats(prev => ({
          ...prev,
          totalCategories: Object.keys(data).length
        }));
      }
    });
  }, []);

  const cards = [
    { title: "Total Posts", value: stats.totalPosts, icon: FileText, color: "text-blue-600" },
    { title: "Total Views", value: stats.totalViews, icon: Eye, color: "text-green-600" },
    { title: "Categories", value: stats.totalCategories, icon: Layers, color: "text-purple-600" },
    { title: "Trending News", value: stats.trendingPosts, icon: TrendingUp, color: "text-red-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                {card.title}
              </CardTitle>
              <card.icon className={card.color} size={20} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-500 text-sm">No recent activity to show.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            {/* Add quick action buttons here */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
