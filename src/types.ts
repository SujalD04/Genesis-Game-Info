export interface Game {
  id: string;
  name: string;
  description: string;
  image: string;
  genre: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  content: string;
  role: string;
}