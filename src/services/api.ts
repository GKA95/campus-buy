import { Product, Vendor, University, CampusService, Order, Review, UniversityId, ProductCategory } from '../types';
import { PRODUCTS, VENDORS, UNIVERSITIES, SERVICES, REVIEWS, MOCK_ORDERS } from '../data/mockData';

/**
 * CampusBuy API Service Layer
 * 
 * This module abstracts data fetching to mirror WooCommerce & Dokan REST APIs.
 * When integrating with WordPress later, simply replace the mock returns with:
 *   const res = await fetch(`${WP_API_URL}/wc/v3/products`);
 *   return await res.json();
 */

export interface ProductFilterParams {
  category?: ProductCategory | 'All';
  universityId?: UniversityId | 'all';
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  vendorId?: string;
}

export const api = {
  // Products (WooCommerce / Dokan products endpoint)
  async getProducts(params?: ProductFilterParams): Promise<Product[]> {
    let result = [...PRODUCTS];

    if (!params) return result;

    if (params.category && params.category !== 'All') {
      result = result.filter(p => p.category === params.category);
    }

    if (params.universityId && params.universityId !== 'all') {
      result = result.filter(p => p.universityId === params.universityId);
    }

    if (params.vendorId) {
      result = result.filter(p => p.vendorId === params.vendorId);
    }

    if (params.searchQuery && params.searchQuery.trim() !== '') {
      const q = params.searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.vendorName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (params.minPrice !== undefined) {
      result = result.filter(p => p.price >= (params.minPrice || 0));
    }

    if (params.maxPrice !== undefined && params.maxPrice > 0) {
      result = result.filter(p => p.price <= (params.maxPrice || Infinity));
    }

    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'featured':
        default:
          result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    }

    return result;
  },

  async getProductById(id: string): Promise<Product | undefined> {
    return PRODUCTS.find(p => p.id === id);
  },

  async getFeaturedProducts(): Promise<Product[]> {
    return PRODUCTS.filter(p => p.featured);
  },

  async getRelatedProducts(productId: string, category: ProductCategory): Promise<Product[]> {
    return PRODUCTS.filter(p => p.id !== productId && p.category === category).slice(0, 4);
  },

  // Vendors (Dokan REST API endpoint)
  async getVendors(universityId?: UniversityId | 'all'): Promise<Vendor[]> {
    if (!universityId || universityId === 'all') {
      return VENDORS;
    }
    return VENDORS.filter(v => v.universityId === universityId);
  },

  async getVendorById(id: string): Promise<Vendor | undefined> {
    return VENDORS.find(v => v.id === id);
  },

  // Universities
  async getUniversities(): Promise<University[]> {
    return UNIVERSITIES;
  },

  async getUniversityById(id: UniversityId): Promise<University | undefined> {
    return UNIVERSITIES.find(u => u.id === id);
  },

  // Campus Services
  async getServices(category?: string, universityId?: UniversityId | 'all'): Promise<CampusService[]> {
    let result = [...SERVICES];
    if (category && category !== 'All') {
      result = result.filter(s => s.category === category);
    }
    if (universityId && universityId !== 'all') {
      result = result.filter(s => s.universityId === universityId);
    }
    return result;
  },

  // Reviews
  async getReviews(): Promise<Review[]> {
    return REVIEWS;
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    return MOCK_ORDERS;
  },

  async createOrder(orderData: Omit<Order, 'id' | 'date'>): Promise<Order> {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: 'Just now'
    };
    return newOrder;
  }
};
