export interface Room {
  id: string;
  slug: string;
  name: string;
  category: string;
  priceNpr: number;
  capacity: string;
  bedType: string;
  sizeSqFt?: number;
  bathroomInfo?: string;
  view?: string;
  image: string;
  galleryImages: string[];
  amenities: string[];
  description: string;
  fullDescription?: string[];
  features?: string[];
  featured?: boolean;
  maxUnits?: number;
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
  slug: string;
  title: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  excerpt: string;
  content: string[];
  image: string;
  tags?: string[];
  featured?: boolean;
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
    slug: 'deluxe-room',
    name: 'Deluxe AC Garden Room',
    category: 'Deluxe',
    priceNpr: 3500,
    capacity: '2 Adults, 1 Child',
    bedType: 'King Size Bed',
    sizeSqFt: 340,
    bathroomInfo: 'Ensuite Bathroom with 24/7 Solar Hot Shower',
    view: 'Lodge Courtyard & Garden View',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200',
    ],
    amenities: [
      'Air Conditioning',
      'Free Wi-Fi',
      'Ensuite Bathroom',
      'Hot Shower',
      'LED TV',
      'Room Service',
      'Breakfast Available',
      'Garden Access',
      'Bottled Water',
      'Daily Housekeeping',
    ],
    description: 'Spacious air-conditioned room surrounded by garden greenery in Bharatpur. Perfect for couples and safari visitors seeking quiet comfort.',
    fullDescription: [
      'Our Deluxe AC Garden Room provides a peaceful retreat inside Motimahal Lodge. Designed with warm Nepalese wooden touches, neutral earth tones, and a large plush King Size bed, this room ensures a restful night after long travel days or wildlife excursions in Chitwan.',
      'Enjoy direct views of our lush inner courtyard garden, high-speed Wi-Fi, individually controlled quiet air conditioning, and a private ensuite bathroom equipped with round-the-clock solar-powered hot shower water.',
    ],
    features: [
      'Plush King Bed with fresh laundered cotton linens',
      'Individual silent split Air Conditioner',
      'Ensuite bathroom with 24-hour solar hot water',
      'Flat-screen LED TV with satellite channels',
      'Seating corner with coffee table and garden view window',
      'Complimentary high-speed Wi-Fi access',
      'Daily housekeeping and fresh towel service',
    ],
    featured: true,
    maxUnits: 6,
  },
  {
    id: 'family-executive-suite',
    slug: 'family-executive-suite',
    name: 'Family Executive Suite',
    category: 'Suite',
    priceNpr: 5200,
    capacity: '4 Adults',
    bedType: '2 Queen Beds',
    sizeSqFt: 480,
    bathroomInfo: 'Spacious Private Bathroom with Solar Hot Water & Vanity',
    view: 'Garden & Mountain Horizon View',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
    ],
    amenities: [
      'Air Conditioning',
      'Free Wi-Fi',
      'Private Balcony',
      'Mini Fridge',
      'Ensuite Bath',
      'Hot Shower',
      'LED TV',
      'Room Service',
      'Breakfast Available',
      'Parking Included',
    ],
    description: 'Generous suite featuring dual queen beds, sitting corner, and view of the Chitwan landscape for family stays.',
    fullDescription: [
      'Designed specifically for families and group travelers, the Family Executive Suite offers abundant space with two comfortable Queen Beds, a dedicated lounge area, and expansive windows welcoming natural sunlight.',
      'Step out onto your private balcony to enjoy morning Nepalese tea while taking in views of the lodge grounds. Complete with a mini fridge for refreshments, silent air conditioning, and prompt room service delivery from our tandoori kitchen.',
    ],
    features: [
      'Two comfortable Queen Size Beds for up to 4 guests',
      'Private balcony seating overlooking garden & courtyard',
      'Compact mini fridge for personal beverages',
      'Living area with sofa set & tea table',
      'Large ensuite bathroom with solar hot shower',
      'High-speed Wi-Fi & LED TV',
      'Dedicated family wardrobe & storage space',
    ],
    featured: true,
    maxUnits: 4,
  },
  {
    id: 'standard-double-room',
    slug: 'standard-room',
    name: 'Standard AC Double Room',
    category: 'Standard',
    priceNpr: 2800,
    capacity: '2 Adults',
    bedType: 'Double Bed',
    sizeSqFt: 260,
    bathroomInfo: 'Attached Bathroom with Hot Shower',
    view: 'Courtyard View',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200',
    ],
    amenities: [
      'Air Conditioning',
      'Free Wi-Fi',
      'Ensuite Bathroom',
      'Hot Shower',
      'Room Service',
      'Daily Housekeeping',
      'Bottled Water',
    ],
    description: 'Clean, well-maintained double room with air conditioning and 24/7 solar hot water for highway stopovers.',
    fullDescription: [
      'The Standard AC Double Room is a cozy, dependable accommodation option for road travelers, safari tourists, and business visitors seeking clean and affordable lodging in Bharatpur.',
      'Features a comfortable double bed, clean cotton bedding, attached private bathroom with solar hot shower, and split air conditioning for year-round climate control.',
    ],
    features: [
      'Comfortable Double Bed with clean fresh linens',
      'Split Air Conditioner for quick cooling',
      'Attached bathroom with 24/7 solar hot shower',
      'Work desk and chair',
      'Free Wi-Fi access throughout stay',
      'Room service available from on-site kitchen',
    ],
    maxUnits: 8,
  },
  {
    id: 'twin-bedroom',
    slug: 'normal-room',
    name: 'Standard Twin AC Room',
    category: 'Standard',
    priceNpr: 2800,
    capacity: '2 Adults',
    bedType: '2 Single Beds',
    sizeSqFt: 270,
    bathroomInfo: 'Attached Bathroom with Hot Shower',
    view: 'Courtyard View',
    image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200',
    galleryImages: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1200',
    ],
    amenities: [
      'Air Conditioning',
      'Free Wi-Fi',
      'Attached Bathroom',
      'Hot Water',
      'Room Service',
      'Daily Housekeeping',
      'Bottled Water',
    ],
    description: 'Comfortable twin bedroom ideal for friends or travel colleagues visiting Chitwan.',
    fullDescription: [
      'Our Standard Twin AC Room offers two separate single beds in a immaculate environment. Ideal for travel companions, safari buddies, or colleagues staying in Chitwan.',
      'Equipped with split air conditioning, attached bathroom with continuous hot water, and complimentary high-speed Wi-Fi.',
    ],
    features: [
      'Two separate single beds with clean comfortable bedding',
      'Air conditioning for cool comfort',
      'Attached private bathroom with solar hot shower',
      'Free high-speed Wi-Fi',
      'On-site restaurant ordering and room service',
    ],
    maxUnits: 6,
  },
];

export function getRoomBySlug(slug: string): Room | undefined {
  const normalized = slug.toLowerCase().trim();
  // 1. Direct match by slug
  let found = ROOMS_DATA.find((r) => r.slug === normalized);
  if (found) return found;

  // 2. Direct match by id
  found = ROOMS_DATA.find((r) => r.id === normalized);
  if (found) return found;

  // 3. Fallback fuzzy matching for expected routes
  if (normalized.includes('deluxe')) {
    return ROOMS_DATA.find((r) => r.slug === 'deluxe-room') || ROOMS_DATA[0];
  }
  if (normalized.includes('suite') || normalized.includes('family')) {
    return ROOMS_DATA.find((r) => r.slug === 'family-executive-suite') || ROOMS_DATA[1];
  }
  if (normalized.includes('normal') || normalized.includes('twin')) {
    return ROOMS_DATA.find((r) => r.slug === 'normal-room') || ROOMS_DATA[3];
  }
  if (normalized.includes('standard')) {
    return ROOMS_DATA.find((r) => r.slug === 'standard-room') || ROOMS_DATA[2];
  }

  // 4. Default fallback to first room
  return ROOMS_DATA[0];
}


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
    slug: 'guide-to-chitwan-safari',
    title: 'Essential Guide for First-Time Chitwan Safari Visitors',
    category: 'Travel Advice',
    date: 'February 12, 2026',
    author: 'Motimahal Family Desk',
    readTime: '5 min read',
    excerpt: 'What to pack, best months for rhino spotting, and how to combine river canoeing with jeep safaris in Chitwan National Park.',
    content: [
      'Chitwan National Park is Nepal’s premier wildlife destination and one of Asia’s best-preserved natural sanctuaries. Home to the endangered One-Horned Rhinoceros, Royal Bengal Tiger, and over 500 species of tropical birds, planning your first safari requires a bit of practical preparation.',
      'The optimal window to visit Chitwan is between October and March when dry weather keeps the jungle trails accessible and natural waterholes attract animals during early morning hours. During these months, temperatures remain pleasant for outdoor jeep excursions and canoe rides along the Rapti River.',
      'When preparing for your safari day, we recommend wearing muted earth-tone clothing (greens, khakis, and browns), bringing sturdy walking shoes, a broad sun hat, high SPF sunblock, and insect repellent. Binoculars and a zoom camera lens will greatly enhance your wildlife viewing experience.',
      'Our family front desk at Motimahal Lodge assists guests daily with booking licensed local jungle guides, open-top 4x4 jeep safaris, and traditional dugout canoe trips along the riverbanks.',
    ],
    image: 'https://images.unsplash.com/photo-1547970810-dc9223d49122?auto=format&fit=crop&q=80&w=1200',
    tags: ['Chitwan National Park', 'Jeep Safari', 'Rhino Spotting', 'Travel Tips'],
    featured: true,
  },
  {
    id: 'secret-to-tandoori-grill',
    slug: 'secret-to-tandoori-grill',
    title: 'The Secret Behind Clay-Oven Charcoal Tandoori Grills',
    category: 'Culinary Story',
    date: 'January 28, 2026',
    author: 'Head Chef Sapkota',
    readTime: '4 min read',
    excerpt: 'Why high-temperature clay oven roasting seals in authentic juices and creates unmatched smoky aroma in our kitchen.',
    content: [
      'At Motimahal Lodge & Tandoori Kitchen, cooking is rooted in time-tested culinary traditions. Our signature tandoori dishes owe their unique flavor and tender texture to our handmade clay tandoor oven fueled by natural wood charcoal.',
      'Every morning, our kitchen staff prepares fresh marinades using locally sourced yogurt, mustard oil, fresh ginger-garlic paste, and traditional Nepalese spices. Meats are marinated for a full 12 hours to allow complex aromatics to deeply penetrate before roasting.',
      'When placed inside the 400°C clay tandoor, radiant heat instantly sears the exterior, locking in natural juices while imparting a smoky charcoal aroma that cannot be replicated on modern gas stovetops.',
      'Whether you are staying with us as a guest or stopping by for dinner during highway travel through Bharatpur, enjoying hot tandoori naan and fresh grilled chicken in our open garden is an essential Chitwan dining experience.',
    ],
    image: 'https://images.unsplash.com/photo-1625220194771-7ebedd0b70b9?auto=format&fit=crop&q=80&w=1200',
    tags: ['Tandoori Kitchen', 'Clay Oven', 'Local Cuisine', 'Food & Dining'],
    featured: true,
  },
  {
    id: 'narayani-river-sunset-walks',
    slug: 'narayani-river-sunset-walks',
    title: 'Evening Strolls & Sunset Views Along the Narayani River',
    category: 'Local Attractions',
    date: 'January 14, 2026',
    author: 'Motimahal Family Desk',
    readTime: '3 min read',
    excerpt: 'Located just 5 minutes from Motimahal Lodge, discover why the Narayani Riverfront is Chitwan’s favorite evening destination.',
    content: [
      'The Narayani River is one of Nepal’s major riverways, flowing peacefully alongside Bharatpur and creating a picturesque promenade popular with locals and visitors alike.',
      'Just a short 5-minute drive or leisurely walk from Motimahal Lodge brings you to the riverfront embankment. As afternoon turns to evening, golden sunlight reflects off the water while gentle river breezes offer welcome cooling.',
      'Local vendors along the promenade serve fresh fried river fish, spiced tea (chia), and local snacks. Small wooden riverboats offer short sightseeing rides across the water, providing panoramic views of the riverbank sunset.',
      'After enjoying the sunset walk, returning to Motimahal Lodge for a hot solar shower and dinner in our courtyard garden makes for a perfect Chitwan evening.',
    ],
    image: '/gallery/narayani-river-gallery.jpg',
    tags: ['Narayani River', 'Sunset Spot', 'Bharatpur Sightseeing', 'Evening Stroll'],
  },
  {
    id: 'highway-travel-stopover-guide-bharatpur',
    slug: 'highway-travel-stopover-guide-bharatpur',
    title: 'Why Bharatpur is the Ideal Highway Rest & Stopover Point',
    category: 'Travel Advice',
    date: 'December 20, 2025',
    author: 'Motimahal Host Family',
    readTime: '4 min read',
    excerpt: 'Connecting Kathmandu, Pokhara, and Chitwan, see why breaking your journey at Motimahal Lodge ensures peaceful rest.',
    content: [
      'Bharatpur sits at the strategic crossroads of Nepal’s major transport corridors—connecting the Prithvi Highway, Mahendra Highway, and routes heading toward the Indian border.',
      'Long overland travel across winding hill roads can be exhausting. Taking a overnight break in Bharatpur-10 allows drivers and families to rest in clean air-conditioned rooms with reliable solar hot water and secure gated parking.',
      'At Motimahal Lodge, our front desk operates 24/7 to welcome late-arriving travelers with warm hospitality, hot tea, and prompt room service.',
    ],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1200',
    tags: ['Bharatpur Highway', 'Stopover', 'Road Travel', 'Motimahal Hospitality'],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  const normalized = slug.toLowerCase().trim();
  let found = BLOG_DATA.find((b) => (b.slug || b.id) === normalized);
  if (found) return found;

  found = BLOG_DATA.find((b) => b.id === normalized);
  if (found) return found;

  return BLOG_DATA.find((b) => normalized.includes(b.id) || b.id.includes(normalized)) || BLOG_DATA[0];
}

export function getRelatedBlogPosts(currentSlug: string, count: number = 3): BlogPost[] {
  const normalized = currentSlug.toLowerCase().trim();
  const filtered = BLOG_DATA.filter((b) => (b.slug || b.id) !== normalized);
  return filtered.slice(0, count);
}

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'narayani-sunset',
    title: 'Narayani River Sunset Promenade',
    category: 'Narayani & Chitwan',
    image: '/gallery/narayani-river-gallery.jpg',
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

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/moti_mahal_restaurant_lodge/',
  facebook: 'https://www.facebook.com/people/Moti-Mahal-Restaurant-Lodge/61592017018419/',
};

