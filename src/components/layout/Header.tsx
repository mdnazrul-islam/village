import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { Search, Tv, Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";

export default function Header() {
  const [dateTime, setDateTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Left: Date & Social */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-sm text-slate-500 font-bangla">
              {format(dateTime, "EEEE, d MMMM yyyy | h:mm:ss a", { locale: bn })}
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <a href="#" className="hover:text-blue-600 transition-colors"><Facebook size={18} /></a>
              <a href="#" className="hover:text-sky-500 transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-red-600 transition-colors"><Youtube size={18} /></a>
              <a href="#" className="hover:text-pink-600 transition-colors"><Instagram size={18} /></a>
            </div>
          </div>

          {/* Center: Logo */}
          <Link to="/" className="text-5xl font-bold text-red-600 tracking-tighter">
            Village
          </Link>

          {/* Right: Search & Live TV */}
          <div className="flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative group">
              <Input
                type="text"
                placeholder="খুঁজুন..."
                className="pl-10 pr-4 py-2 w-64 rounded-full border-slate-200 focus:ring-red-500 font-bangla"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500" size={18} />
            </form>
            <Button variant="destructive" className="rounded-full gap-2 font-bangla">
              <Tv size={18} />
              লাইভ টিভি
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
