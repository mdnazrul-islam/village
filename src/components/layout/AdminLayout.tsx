import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { 
  LayoutDashboard, 
  FileText, 
  Layers, 
  Settings, 
  LogOut, 
  Globe,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    { icon: FileText, label: "Posts", path: "/admin/posts" },
    { icon: Layers, label: "Categories", path: "/admin/categories" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-slate-900 text-white transition-all duration-300 flex flex-col",
        isSidebarOpen ? "w-64" : "w-20"
      )}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <span className="text-xl font-bold">Village Admin</span>}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:bg-slate-800"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        <nav className="flex-grow mt-6">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-6 py-4 transition-colors hover:bg-slate-800",
                location.pathname === item.path && "bg-blue-600 hover:bg-blue-700"
              )}
            >
              <item.icon size={20} />
              {isSidebarOpen && <span className="ml-4">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center px-6 py-4 text-slate-400 hover:text-white transition-colors"
          >
            <Globe size={20} />
            {isSidebarOpen && <span className="ml-4">View Website</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-4 text-red-400 hover:text-red-300 transition-colors"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-4">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-auto">
        <header className="bg-white border-bottom p-6 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-semibold text-slate-800">
            {menuItems.find(item => item.path === location.pathname)?.label || "Admin"}
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{auth.currentUser?.email}</span>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
