import { Link, useLocation } from "react-router-dom";
import { Home, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = [
  { name: "জাতীয়", path: "/category/জাতীয়" },
  { name: "আন্তর্জাতিক", path: "/category/আন্তর্জাতিক" },
  { name: "সারাদেশ", path: "/category/সারাদেশ" },
  { name: "খেলাধুলা", path: "/category/খেলাধুলা" },
  { name: "বিনোদন", path: "/category/বিনোদন" },
  { name: "প্রযুক্তি", path: "/category/প্রযুক্তি" },
  { name: "স্বাস্থ্য", path: "/category/স্বাস্থ্য" },
  { name: "লাইফস্টাইল", path: "/category/লাইফস্টাইল" },
];

const moreCategories = [
  { name: "শিক্ষা", path: "/category/শিক্ষা" },
  { name: "অর্থনীতি", path: "/category/অর্থনীতি" },
  { name: "মতামত", path: "/category/মতামত" },
  { name: "প্রবাস", path: "/category/প্রবাস" },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-slate-900 text-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <ul className="flex items-center overflow-x-auto no-scrollbar py-1">
          <li>
            <Link
              to="/"
              className={cn(
                "flex items-center px-4 py-3 hover:bg-slate-800 transition-colors",
                location.pathname === "/" && "bg-red-600"
              )}
            >
              <Home size={20} />
            </Link>
          </li>
          {categories.map((cat) => (
            <li key={cat.path}>
              <Link
                to={cat.path}
                className={cn(
                  "block px-4 py-3 text-lg font-medium whitespace-nowrap hover:bg-slate-800 transition-colors font-bangla",
                  location.pathname === cat.path && "text-red-500"
                )}
              >
                {cat.name}
              </Link>
            </li>
          ))}
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center px-4 py-3 text-lg font-medium hover:bg-slate-800 transition-colors font-bangla">
                অন্যান্য <ChevronDown size={16} className="ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {moreCategories.map((cat) => (
                  <DropdownMenuItem key={cat.path} asChild>
                    <Link to={cat.path} className="w-full font-bangla text-base py-2">
                      {cat.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </div>
    </nav>
  );
}
