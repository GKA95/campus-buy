export type UniversityId = 'knust' | 'ug' | 'ucc' | 'upsa' | 'uds' | 'uew' | 'ashesi';

export interface University {
  id: UniversityId;
  name: string;
  shortName: string;
  location: string;
  studentCount: string;
  description: string;
  popularHalls: string[];
  bannerColor: string;
  iconInitials: string;
}

export type ProductCategory = 
  | 'Electronics'
  | 'Fashion'
  | 'Food'
  | 'Books'
  | 'Beauty'
  | 'Accessories'
  | 'School Supplies'
  | 'Services';

export interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  category: ProductCategory;
  vendorId: string;
  vendorName: string;
  universityId: UniversityId;
  universityName: string;
  rating: number;
  reviewCount: number;
  stock: number;
  description: string;
  features: string[];
  image: string;
  images: string[];
  deliveryTime: string; // e.g. "Within 2 hrs to campus hostels"
  condition: 'Brand New' | 'Gently Used' | 'Refurbished' | 'Handmade';
  tags: string[];
  featured?: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  universityId: UniversityId;
  universityName: string;
  category: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  avatar: string;
  banner: string;
  bio: string;
  location: string; // e.g. "Ayeduase Gate / Commercial Area"
  phone: string;
  whatsapp: string;
  verified: boolean;
  joinedDate: string;
  responseRate: string;
  deliveryHalls: string[];
}

export interface CampusService {
  id: string;
  title: string;
  category: 'Printing' | 'Laundry' | 'Food Delivery' | 'Graphic Design' | 'Repairs' | 'Photography' | 'Tutoring' | 'Transportation' | 'Accommodation';
  providerName: string;
  universityId: UniversityId;
  universityName: string;
  startingPrice: number;
  priceUnit: string; // e.g., "per page", "per basket", "per hour"
  turnaroundTime: string;
  rating: number;
  reviewCount: number;
  description: string;
  contactNumber: string;
  popularLocations: string[];
}

export interface Review {
  id: string;
  userName: string;
  userUniversity: string;
  rating: number;
  date: string;
  comment: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  vendorName: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';
  deliveryHall: string;
  deliveryRoom?: string;
  university: string;
  paymentMethod: 'Cash on Delivery / Meetup' | 'Mobile Money (MTN/Telecel)';
  contactPhone: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'vendor';
  universityId: UniversityId;
  hallOrHostel: string;
  roomNumber?: string;
  studentIdNumber?: string;
  savedVendors: string[];
  wishlistProductIds: string[];
  avatarInitial: string;
}
