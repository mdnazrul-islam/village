import { ref, set, push, get } from "firebase/database";
import { db } from "./firebase";

export const seedInitialData = async () => {
  const postsRef = ref(db, "posts");
  const snapshot = await get(postsRef);
  
  if (snapshot.exists()) return;

  console.log("Seeding initial data...");

  const categories = [
    "জাতীয়", "আন্তর্জাতিক", "সারাদেশ", "খেলাধুলা", "বিনোদন", "প্রযুক্তি", "স্বাস্থ্য", "লাইফস্টাইল"
  ];

  // Seed Categories
  const catsRef = ref(db, "categories");
  for (const cat of categories) {
    await push(catsRef, { name: cat });
  }

  // Seed Posts
  const samplePosts = [
    {
      title: "বাংলাদেশের অর্থনীতিতে নতুন দিগন্ত: রপ্তানি আয়ে রেকর্ড",
      content: "<p>বাংলাদেশের রপ্তানি আয়ে নতুন রেকর্ড সৃষ্টি হয়েছে। গত মাসে রপ্তানি আয় আগের বছরের তুলনায় ১৫ শতাংশ বৃদ্ধি পেয়েছে। বিশেষ করে তৈরি পোশাক খাতে এই প্রবৃদ্ধি চোখে পড়ার মতো।</p><p>বিশেষজ্ঞরা বলছেন, বিশ্ববাজারে বাংলাদেশের পণ্যের চাহিদা বাড়ছে এবং নতুন নতুন বাজার সৃষ্টি হচ্ছে। এটি দেশের সামগ্রিক অর্থনীতির জন্য একটি ইতিবাচক সংকেত।</p>",
      category: "জাতীয়",
      image: "https://picsum.photos/seed/economy/1200/800",
      timestamp: Date.now() - 3600000,
      views: 1250,
      featured: true,
      breaking: true,
      trending: true
    },
    {
      title: "বিশ্বকাপ ফুটবলে নাটকীয় জয়: শেষ মুহূর্তে গোল করে জয়ী আর্জেন্টিনা",
      content: "<p>বিশ্বকাপ ফুটবলের বাছাইপর্বে আর্জেন্টিনা এক নাটকীয় জয় পেয়েছে। খেলার শেষ মিনিটে লিওনেল মেসির দুর্দান্ত এক গোলে তারা জয় নিশ্চিত করে।</p><p>পুরো ম্যাচ জুড়ে দুই দলই সমানে সমান লড়েছে। তবে শেষ পর্যন্ত আর্জেন্টিনার অভিজ্ঞতাই তাদের জয় এনে দিয়েছে।</p>",
      category: "খেলাধুলা",
      image: "https://picsum.photos/seed/sports/1200/800",
      timestamp: Date.now() - 7200000,
      views: 3400,
      featured: true,
      breaking: false,
      trending: true
    },
    {
      title: "নতুন স্মার্টফোন বাজারে আনলো অ্যাপল: আইফোন ১৬ এর চমক",
      content: "<p>অ্যাপল তাদের নতুন আইফোন ১৬ সিরিজ বাজারে এনেছে। এতে রয়েছে উন্নত ক্যামেরা প্রযুক্তি এবং শক্তিশালী এ১৮ চিপসেট।</p><p>নতুন এই ফোনে এআই (AI) প্রযুক্তির ব্যাপক ব্যবহার করা হয়েছে যা ব্যবহারকারীদের অভিজ্ঞতাকে আরও সহজতর করবে।</p>",
      category: "প্রযুক্তি",
      image: "https://picsum.photos/seed/tech/1200/800",
      timestamp: Date.now() - 10800000,
      views: 890,
      featured: false,
      breaking: false,
      trending: false
    },
    {
      title: "ঢাকায় শুরু হয়েছে আন্তর্জাতিক চলচ্চিত্র উৎসব",
      content: "<p>রাজধানী ঢাকায় শুরু হয়েছে পাঁচ দিনব্যাপী আন্তর্জাতিক চলচ্চিত্র উৎসব। এতে বিশ্বের ৩০টি দেশের ১০০টিরও বেশি চলচ্চিত্র প্রদর্শিত হবে।</p><p>উদ্বোধনী অনুষ্ঠানে উপস্থিত ছিলেন দেশের বরেণ্য চলচ্চিত্র ব্যক্তিত্বরা।</p>",
      category: "বিনোদন",
      image: "https://picsum.photos/seed/movie/1200/800",
      timestamp: Date.now() - 14400000,
      views: 560,
      featured: false,
      breaking: true,
      trending: false
    }
  ];

  for (const post of samplePosts) {
    await push(postsRef, post);
  }

  console.log("Seeding complete!");
};
