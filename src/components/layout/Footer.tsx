import { Link } from "react-router-dom";
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div className="space-y-4">
            <Link to="/" className="text-3xl font-bold text-red-600">Village</Link>
            <p className="text-slate-400 font-bangla text-sm leading-relaxed">
              ভিলেজ নিউজ পোর্টাল বাংলাদেশের অন্যতম জনপ্রিয় অনলাইন সংবাদ মাধ্যম। আমরা বস্তুনিষ্ঠ এবং নিরপেক্ষ সংবাদ পরিবেশনে অঙ্গীকারবদ্ধ।
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors"><Facebook size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors"><Twitter size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors"><Youtube size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-6 font-bangla">বিভাগসমূহ</h3>
            <ul className="grid grid-cols-2 gap-2 text-slate-400 font-bangla">
              <li><Link to="/category/জাতীয়" className="hover:text-red-500">জাতীয়</Link></li>
              <li><Link to="/category/আন্তর্জাতিক" className="hover:text-red-500">আন্তর্জাতিক</Link></li>
              <li><Link to="/category/সারাদেশ" className="hover:text-red-500">সারাদেশ</Link></li>
              <li><Link to="/category/খেলাধুলা" className="hover:text-red-500">খেলাধুলা</Link></li>
              <li><Link to="/category/বিনোদন" className="hover:text-red-500">বিনোদন</Link></li>
              <li><Link to="/category/প্রযুক্তি" className="hover:text-red-500">প্রযুক্তি</Link></li>
              <li><Link to="/category/স্বাস্থ্য" className="hover:text-red-500">স্বাস্থ্য</Link></li>
              <li><Link to="/category/লাইফস্টাইল" className="hover:text-red-500">লাইফস্টাইল</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 font-bangla">জরুরি লিংক</h3>
            <ul className="space-y-2 text-slate-400 font-bangla">
              <li><Link to="/about" className="hover:text-red-500">আমাদের সম্পর্কে</Link></li>
              <li><Link to="/contact" className="hover:text-red-500">যোগাযোগ</Link></li>
              <li><Link to="/privacy" className="hover:text-red-500">গোপনীয়তা নীতি</Link></li>
              <li><Link to="/terms" className="hover:text-red-500">শর্তাবলী</Link></li>
              <li><Link to="/archive" className="hover:text-red-500">আর্কাইভ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-6 font-bangla">যোগাযোগ</h3>
            <ul className="space-y-4 text-slate-400 font-bangla text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-red-500 shrink-0" size={20} />
                <span>১২৩, ভিলেজ টাওয়ার, ঢাকা-১২১২, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-red-500 shrink-0" size={20} />
                <span>+৮৮০ ১২৩৪ ৫৬৭৮৯০</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-red-500 shrink-0" size={20} />
                <span>info@villagenews.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm font-bangla">
          <p>&copy; {new Date().getFullYear()} ভিলেজ নিউজ। সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
      </div>
    </footer>
  );
}
