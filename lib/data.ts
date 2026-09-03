export interface Room {
  id: string;
  name: string;
  category: string;
  priceNpr: number;
  capacity: string;
  bedType: string;
  image: string;
  amenities: string[];
  description: string;
  featured?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  priceNpr: number;
  description: string;
  image: string;
  isPopular?: boolean;
  tags?: string[];
}

export interface Amenity {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Attraction {
  id: string;
  title: string;
  category: string;
  distance: string;
  shortDesc: string;
  fullDesc: string;
  image: string;
  highlights: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  excerpt: string;
  content: string[];
  image: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  caption: string;
  aspect?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export const ROOMS_DATA: Room[] = [
  {
    id: 'deluxe-ac-cottage',
    name: 'Deluxe AC Garden Room',
    category: 'Deluxe',
    priceNpr: 3500,
    capacity: '2 Adults, 1 Child',
    bedType: 'King Size Bed',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    amenities: ['Air Conditioning', 'Free Wi-Fi', 'Ensuite Bathroom', 'Hot Shower', 'LED TV'],
    description: 'Spacious air-conditioned room surrounded by garden greenery in Bharatpur. Perfect for couples and safari visitors seeking quiet comfort.',
    featured: true,
  },
  {
    id: 'family-executive-suite',
    name: 'Family Executive Suite',
    category: 'Suite',
    priceNpr: 5200,
    capacity: '4 Adults',
    bedType: '2 Queen Beds',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800',
    amenities: ['Air Conditioning', 'Free Wi-Fi', 'Private Balcony', 'Mini Fridge', 'Ensuite Bath'],
    description: 'Generous suite featuring dual queen beds, sitting corner, and view of the Chitwan landscape for family stays.',
    featured: true,
  },
  {
    id: 'standard-double-room',
    name: 'Standard AC Double Room',
    category: 'Standard',
    priceNpr: 2800,
    capacity: '2 Adults',
    bedType: 'Double Bed',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
    amenities: ['Air Conditioning', 'Free Wi-Fi', 'Ensuite Bathroom', 'Hot Shower'],
    description: 'Clean, well-maintained double room with air conditioning and 24/7 solar hot water for highway stopovers.',
  },
  {
    id: 'twin-bedroom',
    name: 'Standard Twin AC Room',
    category: 'Standard',
    priceNpr: 2800,
    capacity: '2 Adults',
    bedType: '2 Single Beds',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800',
    amenities: ['Air Conditioning', 'Free Wi-Fi', 'Attached Bathroom', 'Hot Water'],
    description: 'Comfortable twin bedroom ideal for friends or travel colleagues visiting Chitwan.',
  },
];

export const FOOD_MENU_DATA: MenuItem[] = [
  {
    id: 'tandoori-chicken-full',
    name: 'Clay-Oven Tandoori Chicken (Full)',
    category: 'Tandoori & BBQ',
    priceNpr: 1200,
    description: 'Fresh chicken marinated overnight in Nepalese spices, yogurt, and mustard oil, roasted in clay tandoor over natural charcoal.',
    image: 'https://images.unsplash.com/photo-1625220194771-7ebedd0b70b9?auto=format&fit=crop&q=80&w=800',
    isPopular: true,
    tags: ['Best Seller', 'Clay Oven', 'Fresh Grill'],
  },
  {
    id: 'thakali-thali-set',
    name: 'Authentic Nepalese Thakali Set',
    category: 'Set Menus',
    priceNpr: 450,
    description: 'Steaming local rice, black lentil daal, mustard spinach, fermented radish pickle, ghee, and choice of mutton, chicken, or veg curry.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800',
    isPopular: true,
    tags: ['Local Favorite', 'Unlimited Refill'],
  },
  {
    id: 'garlic-butter-naan',
    name: 'Fresh Garlic Butter Naan (2 pcs)',
    category: 'Tandoori & BBQ',
    priceNpr: 180,
    description: 'Hand-stretched dough baked on internal clay tandoor walls, brushed with fresh garlic and melted butter.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
    tags: ['Tandoor Breads'],
  },
];

export const ATTRACTIONS_DATA: Attraction[] = [
  {
    id: 'chitwan-national-park',
    title: 'Chitwan National Park Safari',
    category: 'Wildlife & Safari',
    distance: '18 km (30 mins drive)',
    shortDesc: 'UNESCO World Heritage wildlife reserve famous for One-Horned Rhinos, Bengal Tigers, and elephant canoe rides.',
    fullDesc: 'Chitwan National Park is Nepal’s premier wildlife destination. Guests can participate in morning jeep safaris, peaceful river canoeing on the Rapti river, and guided jungle bird watching walks.',
    image: 'https://images.unsplash.com/photo-1547970810-dc9223d49122?auto=format&fit=crop&q=80&w=800',
    highlights: ['Jeep Safari', 'Rapti River Canoe', 'Rhino Spotting', 'Elephant Breeding Center'],
  },
  {
    id: 'narayani-river-promenade',
    title: 'Narayani Riverfront Promenade',
    category: 'Scenic Sunset',
    distance: '1.5 km (5 mins drive)',
    shortDesc: 'Peaceful riverwalk embankment offering sunset views, local food stalls, and river boat rides.',
    fullDesc: 'Located just minutes from Motimahal Lodge, the Narayani Riverfront is a favorite evening spot for locals and travelers alike. Enjoy cool river breezes, fresh fried river fish, and sunset over the water.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
    highlights: ['Sunset River Views', 'Evening Strolls', 'Boating Rides', 'Local Food Stalls'],
  },
];

export const BLOG_DATA: BlogPost[] = [
  {
    id: 'guide-to-chitwan-safari',
    title: 'Essential Guide for First-Time Chitwan Safari Visitors',
    category: 'Travel Advice',
    date: 'February 12, 2026',
    author: 'Motimahal Family Desk',
    excerpt: 'What to pack, best months for rhino spotting, and how to combine river canoeing with jeep safaris.',
    content: [
      'Chitwan National Park is one of Asia’s best-preserved wildlife sanctuaries...',
      'Best time to visit is October to March when temperatures are pleasant and grass height allows high visibility for wildlife.',
    ],
    image: 'https://images.unsplash.com/photo-1547970810-dc9223d49122?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 'secret-to-tandoori-grill',
    title: 'The Secret Behind Clay-Oven Charcoal Tandoori Grills',
    category: 'Culinary Story',
    date: 'January 28, 2026',
    author: 'Head Chef Sapkota',
    excerpt: 'Why high-temperature clay oven roasting seals in juices and creates unmatched aromatic flavor.',
    content: [
      'Our family kitchen marinates chicken in mustard oil and ground spices for 12 hours before roasting in high-heat clay ovens.',
    ],
    image: 'https://images.unsplash.com/photo-1625220194771-7ebedd0b70b9?auto=format&fit=crop&q=80&w=800',
  },
];

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'narayani-sunset',
    title: 'Narayani River Sunset Promenade',
    category: 'Narayani & Chitwan',
    image: '/narayani-river-gallery.jpg',
    caption: 'Evening calm along Narayani River in Bharatpur, minutes from Motimahal Lodge.',
    aspect: 'aspect-16/10',
  },
  {
    id: 'deluxe-ac-room',
    title: 'Deluxe AC Garden Room Interior',
    category: 'Rooms',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800',
    caption: 'Spacious air-conditioned bedroom with clean linen and garden view.',
    aspect: 'aspect-4/3',
  },
  {
    id: 'tandoori-clay-oven',
    title: 'Charcoal Clay-Oven Tandoori Grills',
    category: 'Tandoori Dining',
    image: 'https://images.unsplash.com/photo-1625220194771-7ebedd0b70b9?auto=format&fit=crop&q=80&w=800',
    caption: 'Fresh chicken and naan bread roasted daily over charcoal in our clay tandoor.',
    aspect: 'aspect-square',
  },
  {
    id: 'lodge-courtyard',
    title: 'Lodge Courtyard & Garden Lawns',
    category: 'Lodge & Grounds',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800',
    caption: 'Quiet green courtyard garden where guests gather for morning tea and evening relaxation.',
    aspect: 'aspect-16/10',
  },
  {
    id: 'nepalese-thali-set',
    title: 'Nepalese Thakali Meal Set',
    category: 'Tandoori Dining',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800',
    caption: 'Traditional thali set with local rice, black lentil daal, ghee, and fresh pickles.',
    aspect: 'aspect-square',
  },
  {
    id: 'family-executive-suite',
    title: 'Family Executive Suite View',
    category: 'Rooms',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800',
    caption: 'Generous suite featuring dual queen beds and sitting area for family stays.',
    aspect: 'aspect-4/3',
  },
  {
    id: 'chitwan-rhino-safari',
    title: 'Chitwan Wildlife Jeep Safari',
    category: 'Narayani & Chitwan',
    image: 'https://images.unsplash.com/photo-1547970810-dc9223d49122?auto=format&fit=crop&q=80&w=800',
    caption: 'One-Horned Rhinoceros spotted during a morning safari in Chitwan National Park.',
    aspect: 'aspect-16/10',
  },
  {
    id: 'garden-evening-glow',
    title: 'Evening Garden Outdoor Seating',
    category: 'Lodge & Grounds',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
    caption: 'Outdoor garden dining tables illuminated under Chitwan evening skies.',
    aspect: 'aspect-4/3',
  },
  {
    id: 'standard-double',
    title: 'Standard AC Room Details',
    category: 'Rooms',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
    caption: 'Clean, comfortable room with ensuite hot shower and air conditioning.',
    aspect: 'aspect-square',
  },
];

export const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 't1',
    name: 'Saugat & Family',
    location: 'Kathmandu, Nepal',
    rating: 5,
    comment: 'Motimahal Lodge is our fixed stop whenever traveling through Bharatpur. Clean rooms, strong hot shower, and the tandoori chicken is unbelievable!',
    date: 'January 2026',
  },
  {
    id: 't2',
    name: 'Mark & Sarah',
    location: 'Melbourne, Australia',
    rating: 5,
    comment: 'The family hosts helped us book our Chitwan safari jeep within 10 minutes of arriving. Extremely hospitable and great food.',
    date: 'December 2025',
  },
  {
    id: 't3',
    name: 'Prashant Sapkota',
    location: 'Pokhara, Nepal',
    rating: 5,
    comment: 'Highly recommended for anyone looking for authentic Nepalese family hospitality, spacious AC rooms, and peaceful location in Bharatpur.',
    date: 'November 2025',
  },
];
