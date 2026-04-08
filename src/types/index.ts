export interface Post {
  id: string;
  title: string;
  content: string;
  image: string;
  category: string;
  timestamp: number;
  views: number;
  featured: boolean;
  breaking: boolean;
  trending?: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Comment {
  id: string;
  postId: string;
  user: string;
  comment: string;
  time: number;
  approved: boolean;
}
