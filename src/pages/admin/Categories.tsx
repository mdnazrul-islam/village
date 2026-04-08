import React, { useState, useEffect } from "react";
import { ref, onValue, push, set, remove, update } from "firebase/database";
import { db } from "@/lib/firebase";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const catsRef = ref(db, "categories");
    onValue(catsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val }));
        setCategories(list);
      }
    });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    setLoading(true);
    try {
      const newCatRef = push(ref(db, "categories"));
      await set(newCatRef, { name: newCategory.trim() });
      setNewCategory("");
      toast.success("Category added!");
    } catch (error) {
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) return;
    try {
      await update(ref(db, `categories/${id}`), { name: editingName.trim() });
      setEditingId(null);
      toast.success("Category updated!");
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure? This will not delete posts in this category but they will lose their category reference.")) {
      try {
        await remove(ref(db, `categories/${id}`));
        toast.success("Category deleted!");
      } catch (error) {
        toast.error("Failed to delete category");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="flex gap-4">
            <Input 
              placeholder="Category name (e.g. খেলাধুলা)" 
              value={newCategory}
              onChange={e => setNewCategory(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} className="mr-2" />}
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="p-6 flex items-center justify-between">
              {editingId === cat.id ? (
                <div className="flex gap-2 w-full">
                  <Input 
                    value={editingName} 
                    onChange={e => setEditingName(e.target.value)}
                    className="flex-grow"
                  />
                  <Button size="sm" onClick={() => handleUpdate(cat.id)}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Button>
                </div>
              ) : (
                <>
                  <span className="text-lg font-medium">{cat.name}</span>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => {
                      setEditingId(cat.id);
                      setEditingName(cat.name);
                    }}>
                      <Edit size={18} className="text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}>
                      <Trash2 size={18} className="text-red-600" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
