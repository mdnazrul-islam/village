import React, { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save, Upload, Loader2 } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: "Village",
    logo: "",
    contactEmail: "",
    facebookUrl: "",
    youtubeUrl: ""
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const settingsRef = ref(db, "settings");
    onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setSettings(data);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await update(ref(db, "settings"), settings);
      toast.success("Settings updated successfully!");
    } catch (error) {
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const logoRef = storageRef(storage, `site/logo_${Date.now()}`);
      await uploadBytes(logoRef, file);
      const url = await getDownloadURL(logoRef);
      setSettings(prev => ({ ...prev, logo: url }));
      toast.success("Logo uploaded!");
    } catch (error) {
      toast.error("Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Configure your website's basic information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Website Name</Label>
                <Input 
                  id="siteName" 
                  value={settings.siteName}
                  onChange={e => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={settings.contactEmail}
                  onChange={e => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Website Logo</Label>
              <div className="flex items-center gap-6 p-4 border rounded-lg bg-slate-50">
                <div className="w-32 h-16 bg-white border rounded flex items-center justify-center overflow-hidden">
                  {settings.logo ? (
                    <img src={settings.logo} alt="Logo" className="max-h-full" />
                  ) : (
                    <span className="text-slate-300 font-bold text-xl">Village</span>
                  )}
                </div>
                <div className="flex-grow">
                  <Input type="file" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
                  <p className="text-xs text-slate-500 mt-1">PNG or SVG recommended</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fb">Facebook URL</Label>
                <Input 
                  id="fb" 
                  value={settings.facebookUrl}
                  onChange={e => setSettings(prev => ({ ...prev, facebookUrl: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yt">YouTube URL</Label>
                <Input 
                  id="yt" 
                  value={settings.youtubeUrl}
                  onChange={e => setSettings(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription>Sensitive administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive">Reset All Statistics</Button>
        </CardContent>
      </Card>
    </div>
  );
}
