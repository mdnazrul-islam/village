import React, { useState, useEffect } from "react";
import { ref, onValue, push, set, remove, update } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Post, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Search, Image as ImageIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    image: "",
    featured: false,
    breaking: false,
    trending: false
  });

  useEffect(() => {
    const postsRef = ref(db, "posts");
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })).reverse();
        setPosts(list);
      }
    });

    const catsRef = ref(db, "categories");
    onValue(catsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val }));
        setCategories(list);
      }
    });
  }, []);

  const handleOpenDialog = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        content: post.content,
        category: post.category,
        image: post.image,
        featured: post.featured,
        breaking: post.breaking,
        trending: post.trending || false
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: "",
        content: "",
        category: "",
        image: "",
        featured: false,
        breaking: false,
        trending: false
      });
    }
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imgRef = storageRef(storage, `news/${Date.now()}_${file.name}`);
      await uploadBytes(imgRef, file);
      const url = await getDownloadURL(imgRef);
      setFormData(prev => ({ ...prev, image: url }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content || !formData.category) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      if (editingPost) {
        await update(ref(db, `posts/${editingPost.id}`), {
          ...formData,
          timestamp: editingPost.timestamp // Keep original timestamp or update? User usually wants original
        });
        toast.success("Post updated successfully!");
      } else {
        const newPostRef = push(ref(db, "posts"));
        await set(newPostRef, {
          ...formData,
          timestamp: Date.now(),
          views: 0
        });
        toast.success("Post created successfully!");
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await remove(ref(db, `posts/${id}`));
        toast.success("Post deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete post");
      }
    }
  };

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input 
            placeholder="Search posts..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="w-full md:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? "Edit Post" : "Add New Post"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title (Bangla)</Label>
                    <Input 
                      id="title" 
                      value={formData.title} 
                      onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={val => setFormData(prev => ({ ...prev, category: val }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 border rounded flex items-center justify-center overflow-hidden bg-slate-50">
                        {formData.image ? (
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-slate-300" size={32} />
                        )}
                      </div>
                      <div className="flex-grow">
                        <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                        <p className="text-xs text-slate-500 mt-1">Recommended size: 1200x800px</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Featured News</Label>
                      <p className="text-xs text-slate-500">Show in hero slider</p>
                    </div>
                    <Switch 
                      checked={formData.featured} 
                      onCheckedChange={val => setFormData(prev => ({ ...prev, featured: val }))} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Breaking News</Label>
                      <p className="text-xs text-slate-500">Show in scrolling ticker</p>
                    </div>
                    <Switch 
                      checked={formData.breaking} 
                      onCheckedChange={val => setFormData(prev => ({ ...prev, breaking: val }))} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Trending</Label>
                      <p className="text-xs text-slate-500">Mark as trending</p>
                    </div>
                    <Switch 
                      checked={formData.trending} 
                      onCheckedChange={val => setFormData(prev => ({ ...prev, trending: val }))} 
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content (HTML supported)</Label>
                <Textarea 
                  id="content" 
                  className="min-h-[300px]" 
                  value={formData.content}
                  onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={loading || uploading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingPost ? "Update Post" : "Create Post"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Image</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Title</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Views</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredPosts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded overflow-hidden">
                    <img src={post.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs font-medium text-slate-800 truncate">{post.title}</div>
                  <div className="flex gap-1 mt-1">
                    {post.featured && <span className="text-[10px] bg-blue-100 text-blue-600 px-1 rounded">Featured</span>}
                    {post.breaking && <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">Breaking</span>}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{post.category}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{post.views}</td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {format(new Date(post.timestamp), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(post)}>
                      <Edit size={18} className="text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)}>
                      <Trash2 size={18} className="text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
