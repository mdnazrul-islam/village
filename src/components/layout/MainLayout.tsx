import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navigation from "./Navigation";
import Footer from "./Footer";
import BreakingNews from "../common/BreakingNews";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navigation />
      <BreakingNews />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
