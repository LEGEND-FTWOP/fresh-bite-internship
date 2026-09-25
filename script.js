/**
 * FreshBite India — Authentic Gourmet Food Ordering Platform
 * Client-Side JavaScript: State, Data Models, Cart, Loyalty & Routing
 */

// DOM & LocalStorage Utilities
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const getStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(fallback)
      ? (Array.isArray(parsed) ? parsed : (parsed?.items || fallback))
      : (typeof fallback === 'number' ? (isNaN(Number(raw)) ? fallback : Number(raw)) : parsed);
  } catch {
    return fallback;
  }
};

const setStorage = (key, val) => {
  try {
    localStorage.setItem(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
};

// 1. DATA MODELS (Authentic Indian Kitchens & Dishes)
const RESTAURANTS = [
  {
    id: 'rest-1',
    name: 'Pind Punjab Tandoor & Curries',
    cuisine: 'punjabi',
    cuisineLabel: 'North Indian • Butter Chicken • Dal Makhani',
    rating: 4.9,
    reviewsCount: 2450,
    deliveryTime: '25-35 min',
    priceTier: '₹₹',
    isVegOnly: false,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
    tagline: 'Clay oven tandoori kebabs, slow-simmered rich gravies, and garlic butter naans.'
  },
  {
    id: 'rest-2',
    name: 'Hyderabadi Bawarchi Biryani',
    cuisine: 'biryani',
    cuisineLabel: 'Hyderabadi • Dum Biryani • Kebabs',
    rating: 4.9,
    reviewsCount: 3890,
    deliveryTime: '30-40 min',
    priceTier: '₹₹',
    isVegOnly: false,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    tagline: 'Kacche gosht ki dum biryani prepared with aged Daawat basmati & pure ghee.'
  },
  {
    id: 'rest-3',
    name: 'Sagar Ratna South Indian Tiffin',
    cuisine: 'south-indian',
    cuisineLabel: 'Pure Veg • Ghee Podi Dosa • Idli Vada',
    rating: 4.8,
    reviewsCount: 1920,
    deliveryTime: '20-30 min',
    priceTier: '₹',
    isVegOnly: true,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=800&q=80',
    tagline: 'Crispy golden ghee roast dosas, piping hot sambar, and authentic filter coffee.'
  },
  {
    id: 'rest-4',
    name: 'Royal Awadh Dawat-e-Khaas',
    cuisine: 'mughlai',
    cuisineLabel: 'Lucknowi • Galouti Kebabs • Shahi Korma',
    rating: 4.8,
    reviewsCount: 1540,
    deliveryTime: '30-45 min',
    priceTier: '₹₹₹',
    isVegOnly: false,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    tagline: 'Centuries-old royal secret recipes simmered over slow charcoal dum.'
  },
  {
    id: 'rest-5',
    name: 'Delhi 6 Chaat & Street Zaika',
    cuisine: 'street-food',
    cuisineLabel: 'Street Food • Chole Bhature • Pav Bhaji',
    rating: 4.7,
    reviewsCount: 2840,
    deliveryTime: '15-25 min',
    priceTier: '₹',
    isVegOnly: true,
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80',
    tagline: 'Crispy fluffy bhature, spicy pindi chole, tangy raj kachori, and buttery pav bhaji.'
  },
  {
    id: 'rest-6',
    name: 'Mithai Mahal & Royal Desserts',
    cuisine: 'sweets',
    cuisineLabel: 'Mithai • Gulab Jamun • Rasmalai',
    rating: 4.9,
    reviewsCount: 1670,
    deliveryTime: '15-25 min',
    priceTier: '₹',
    isVegOnly: true,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    tagline: 'Pure desi ghee sweets, saffron rasmalai, rabdi jalebi, and dry fruit laddoos.'
  }
];

const DISHES = [
  {
    id: 'dish-1',
    restaurantId: 'rest-2',
    name: 'Royal Hyderabadi Chicken Dum Biryani',
    category: 'biryani',
    price: 340,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80',
    description: 'Aged basmati rice cooked on slow charcoal dum with succulent chicken cuts marinated in yogurt, brown onions, fresh mint, and saffron milk. Served with Mirchi ka Salan and creamy Raita.',
    dietary: ['non-veg', 'gluten-free'],
    isFeatured: true,
    ingredients: ['Aged Basmati Rice', 'Farm Chicken', 'Kashmiri Saffron', 'Desi Ghee', 'Fried Onions'],
    nutrition: { calories: 680, protein: '38g', carbs: '74g', fat: '24g' },
    rating: 4.9,
    reviews: ['"The aroma of real saffron and ghee fills the room! Unbeatable taste." — Rahul Sharma', '"Authentic Hyderabadi flavor with tender meat." — Sneha Reddy']
  },
  {
    id: 'dish-2',
    restaurantId: 'rest-1',
    name: 'Classic Murgh Makhani (Butter Chicken)',
    category: 'punjabi',
    price: 380,
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80',
    description: 'Charcoal-grilled tandoori chicken tikka simmered in a velvety, satin tomato gravy enriched with fresh butter, cashew paste, and aromatic Kasuri Methi.',
    dietary: ['non-veg'],
    isFeatured: true,
    ingredients: ['Tandoori Chicken', 'Fresh Butter', 'Cashew Cream', 'Plum Tomatoes', 'Kasuri Methi'],
    nutrition: { calories: 720, protein: '42g', carbs: '32g', fat: '44g' },
    rating: 4.9,
    reviews: ['"Silky smooth gravy with just the right amount of sweetness and spice!" — Aditya Verma']
  },
  {
    id: 'dish-3',
    restaurantId: 'rest-1',
    name: 'Dal Makhani Bukhara Style',
    category: 'punjabi',
    price: 260,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    description: 'Whole black urad lentils slow-cooked overnight for 24 hours on tandoor embers with organic churned butter and fresh cream. The king of Punjabi dals.',
    dietary: ['veg'],
    isFeatured: true,
    ingredients: ['Black Urad Dal', 'Churned White Butter', 'Fresh Cream', 'Tomato Purée'],
    nutrition: { calories: 510, protein: '22g', carbs: '56g', fat: '22g' },
    rating: 4.8,
    reviews: ['"Tastes exactly like the iconic ITC Bukhara recipe. Rich and creamy!" — Simran Kaur']
  },
  {
    id: 'dish-4',
    restaurantId: 'rest-1',
    name: 'Paneer Tikka Butter Masala',
    category: 'punjabi',
    price: 310,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    description: 'Fresh malai cottage cheese cubes marinated in tandoori spices, smoked in clay oven, and folded into an aromatic spiced tomato-onion lababdar masala.',
    dietary: ['veg'],
    isFeatured: false,
    ingredients: ['Fresh Malai Paneer', 'Tandoori Masala', 'Bell Peppers', 'Butter Cream'],
    nutrition: { calories: 590, protein: '24g', carbs: '38g', fat: '36g' },
    rating: 4.8,
    reviews: ['"Super soft paneer that melts in your mouth." — Pooja Iyer']
  },
  {
    id: 'dish-5',
    restaurantId: 'rest-3',
    name: 'Special Ghee Mysore Masala Dosa',
    category: 'south-indian',
    price: 180,
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=600&q=80',
    description: 'Golden fermented rice-lentil crepe smeared with spicy red Mysore chutney, roasted crisp in pure A2 ghee, stuffed with spiced potato masala. Served with 3 coconut chutneys and hot drumstick sambar.',
    dietary: ['veg', 'gluten-free'],
    isFeatured: true,
    ingredients: ['Fermented Batter', 'Pure Cow Ghee', 'Mysore Red Chutney', 'Potato Masala'],
    nutrition: { calories: 420, protein: '12g', carbs: '64g', fat: '14g' },
    rating: 4.9,
    reviews: ['"Crispy, aromatic with pure ghee aroma. Authentic South Indian bliss!" — Karthik Swaminathan']
  },
  {
    id: 'dish-6',
    restaurantId: 'rest-5',
    name: 'Delhi Style Chole Bhature (2 pcs)',
    category: 'street-food',
    price: 190,
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80',
    description: 'Fluffy, ballooned paneer-stuffed bhature paired with spicy dark Pindi chole simmered with pomegranate seeds and dry amla. Served with pickled carrots and green chilies.',
    dietary: ['veg'],
    isFeatured: true,
    ingredients: ['Kabuli Chana', 'Pindi Masala', 'Fluffy Bhature Dough', 'Stuffed Paneer'],
    nutrition: { calories: 640, protein: '18g', carbs: '78g', fat: '28g' },
    rating: 4.8,
    reviews: ['"Brings back memories of Chandni Chowk street food! Outstanding." — Gaurav Mehra']
  },
  {
    id: 'dish-7',
    restaurantId: 'rest-5',
    name: 'Mumbai Special Butter Pav Bhaji',
    category: 'street-food',
    price: 180,
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=600&q=80',
    description: 'Spiced mash of cauliflower, green peas, and potatoes cooked on a flat tawa with generous dollops of Amul butter, served with butter-toasted ladi pavs, chopped red onions, and lemon wedges.',
    dietary: ['veg'],
    isFeatured: false,
    ingredients: ['Fresh Vegetables', 'Special Pav Bhaji Masala', 'Amul Butter', 'Fresh Ladi Pav'],
    nutrition: { calories: 520, protein: '14g', carbs: '68g', fat: '22g' },
    rating: 4.7,
    reviews: ['"Extra butter makes all the difference! Delicious street flavor." — Ritu Desai']
  },
  {
    id: 'dish-8',
    restaurantId: 'rest-4',
    name: 'Lucknowi Melt-in-Mouth Galouti Kebabs',
    category: 'mughlai',
    price: 360,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    description: 'Velvety minced patties infused with 160 royal Awadhi spices, smoked with clove and charcoal, pan-fried on mahi tawa. Served on warm Mughlai Ulte Tawe ka Paratha.',
    dietary: ['non-veg'],
    isFeatured: true,
    ingredients: ['Minced Meat', 'Raw Papaya', 'Awadhi 160 Spices', 'Desi Ghee', 'Ulte Tawe Paratha'],
    nutrition: { calories: 580, protein: '36g', carbs: '28g', fat: '36g' },
    rating: 4.9,
    reviews: ['"Literally dissolves in your mouth like silk. True royal indulgence!" — Farhan Qureshi']
  },
  {
    id: 'dish-9',
    restaurantId: 'rest-3',
    name: 'Steamed Rava Idli & Medu Vada Combo',
    category: 'south-indian',
    price: 140,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    description: 'Two feather-light steamed semolina idlis garnished with cashews paired with a crispy, golden lentil Medu Vada. Served with piping hot drumstick sambar and fresh mint chutney.',
    dietary: ['vegan'],
    isFeatured: false,
    ingredients: ['Rava Semolina', 'Urad Dal', 'Cashews & Curry Leaves', 'Hing & Mustard'],
    nutrition: { calories: 360, protein: '14g', carbs: '56g', fat: '8g' },
    rating: 4.7,
    reviews: ['"Super healthy, light, and delicious breakfast." — Deepa Nair']
  },
  {
    id: 'dish-10',
    restaurantId: 'rest-6',
    name: 'Kesariya Angoori Gulab Jamun & Rabdi',
    category: 'sweets',
    price: 130,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80',
    description: 'Warm, soft khoya dumplings fried in pure cow ghee and soaked in saffron cardamom syrup, served over chilled slow-reduced Lachha Rabdi with slivered pistachios.',
    dietary: ['veg'],
    isFeatured: true,
    ingredients: ['Pure Mawa (Khoya)', 'Desi Cow Ghee', 'Saffron Cardamom Syrup', 'Lachha Rabdi'],
    nutrition: { calories: 420, protein: '9g', carbs: '58g', fat: '18g' },
    rating: 4.9,
    reviews: ['"Warm gulab jamun with cold thick rabdi is the best combination ever!" — Vikram Patel']
  }
];

const PROMO_CODES = {
  'FRESH50': { discount: 0.50, max: 150, minOrder: 299, desc: '50% OFF (Up to ₹150 on orders above ₹299)' },
  'BITE20': { discount: 0.20, max: 100, minOrder: 199, desc: '20% OFF (Up to ₹100 on orders above ₹199)' },
  'DESI100': { discount: 100, flat: true, max: 100, minOrder: 499, desc: 'Flat ₹100 OFF (On royal feasts above ₹499)' },
  'TASTY15': { discount: 0.15, max: 75, minOrder: 149, desc: '15% OFF (Up to ₹75 on orders above ₹149)' }
};

const TEAM_MEMBERS = [
  { name: 'Chef Ranveer Brar', role: 'Executive Culinary Director', image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=400&q=80', desc: 'Renowned Indian master chef bringing 22 years of royal Awadhi and street food heritage.' },
  { name: 'Chef Sanjeev Verma', role: 'Head of Tandoori & Mughlai', image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=400&q=80', desc: 'Specialist in 24-hour slow-cooked Bukhara gravies and live clay oven charcoal grilling.' },
  { name: 'Chef Ananya Sen', role: 'Master of Regional & Coastal Flavors', image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?auto=format&fit=crop&w=400&q=80', desc: 'Passionate researcher of ancient spice blends, Chettinad curries, and organic grains.' }
];

const AWARDS = [
  { year: '2025', title: 'Best Cloud Kitchen Platform of India', org: 'Times Food & Nightlife Awards' },
  { year: '2024', title: 'Top Indian Culinary Innovation', org: 'Indian Restaurant Congress' },
  { year: '2023', title: 'Fastest 25-Min Hot Food Delivery Award', org: 'Zomato Foodie Summit' }
];

// Address Sanitization & Formatting Helpers
const DEFAULT_ADDRESSES = [
  '🏠 Home — Flat 402, Prestige Shantiniketan, Whitefield, Bengaluru - 560066',
  '🏢 Office — DLF Cyber City, Building 10, Gurugram, NCR - 122002'
];

const sanitizeAddress = addr => {
  if (!addr) return '';
  if (typeof addr === 'string') {
    const trimmed = addr.trim();
    if (trimmed === '[object Object]' || trimmed.toLowerCase().includes('[object object]') || trimmed === '') {
      return '';
    }
    return trimmed;
  }
  if (typeof addr === 'object') {
    const tag = addr.tag || addr.type || addr.label || '🏠 Home';
    if (typeof addr.fullAddress === 'string' && addr.fullAddress && !addr.fullAddress.includes('[object')) {
      return addr.fullAddress.includes('—') ? addr.fullAddress : `${tag} — ${addr.fullAddress}`;
    }
    if (typeof addr.address === 'string' && addr.address && !addr.address.includes('[object')) {
      return addr.address.includes('—') ? addr.address : `${tag} — ${addr.address}`;
    }
    const flat = addr.flat || addr.house || addr.houseNo || addr.flatNo || addr.line1 || '';
    const area = addr.area || addr.street || addr.locality || addr.line2 || '';
    const city = addr.city || '';
    const pin = addr.pincode || addr.pin || addr.zip || '';
    const parts = [];
    if (flat) parts.push(flat);
    if (area) parts.push(area);
    if (city && pin) parts.push(`${city} - ${pin}`);
    else if (city) parts.push(city);
    else if (pin) parts.push(pin);
    if (parts.length > 0) {
      return `${tag} — ${parts.join(', ')}`;
    }
    return '';
  }
  return '';
};

const normalizeAddresses = addrs => {
  if (!Array.isArray(addrs)) {
    if (addrs && typeof addrs === 'object') {
      const single = sanitizeAddress(addrs);
      return single ? [single, DEFAULT_ADDRESSES[1]] : [...DEFAULT_ADDRESSES];
    }
    return [...DEFAULT_ADDRESSES];
  }
  const cleaned = addrs.map(sanitizeAddress).filter(a => Boolean(a) && a !== '[object Object]');
  return cleaned.length > 0 ? cleaned : [...DEFAULT_ADDRESSES];
};

// 2. CENTRAL APPLICATION STATE
const AppState = {
  cart: Array.isArray(getStorage('freshbite_cart', [])) ? getStorage('freshbite_cart', []) : [],
  wishlist: Array.isArray(getStorage('freshbite_wishlist', ['dish-1', 'dish-2'])) ? getStorage('freshbite_wishlist', ['dish-1', 'dish-2']) : ['dish-1', 'dish-2'],
  orders: Array.isArray(getStorage('freshbite_orders', [])) ? getStorage('freshbite_orders', []).map(o => ({
    ...o,
    deliveryAddress: sanitizeAddress(o.deliveryAddress) || DEFAULT_ADDRESSES[0]
  })) : [],
  appliedPromo: null,
  appliedCredits: 0,
  selectedAddressTag: '🏠 Home',
  selectedAddress: '',
  tip: 30,
  user: {
    name: 'Priya Sharma',
    email: 'priya.sharma@freshbite.in',
    phone: '+91 98765 43210',
    credits: getStorage('freshbite_credits', 250),
    addresses: normalizeAddresses(getStorage('freshbite_addresses', DEFAULT_ADDRESSES))
  },
  currentView: 'home',
  dietaryFilter: 'all',
  categoryFilter: 'all',
  searchQuery: '',
  deliveryPartner: {
    name: 'Vikram Sharma',
    vehicle: 'Hero Electric Optima (KA-03-EK-9482)',
    phone: '+91 98765 12345',
    rating: 4.96
  },
  paymentMethod: 'upi',
  deliverySlot: '⚡ Lightning Express (25-35 min)'
};

// 3. MAIN CONTROLLER
const FreshBite = {
  init() {
    // Sanitize state loaded from storage to fix any previous corrupted data
    AppState.user.addresses = normalizeAddresses(AppState.user.addresses);
    AppState.selectedAddress = sanitizeAddress(AppState.selectedAddress) || AppState.user.addresses[0] || DEFAULT_ADDRESSES[0];
    this.saveState();

    this.bindEvents();
    this.updateBadges();
    this.renderCart();
    this.populateCheckoutAddresses();
    this.renderHome();
    this.renderRestaurants();
    this.renderMenu();
    this.renderAbout();
    this.renderContact();
  },

  navigate(viewId) {
    AppState.currentView = viewId;
    $$('.view-section').forEach(sec => sec.classList.remove('active'));
    $$('.nav-link, .dock-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewId);
    });

    const target = $(`view-${viewId}`);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  },

  saveState() {
    setStorage('freshbite_cart', AppState.cart);
    setStorage('freshbite_wishlist', AppState.wishlist);
    setStorage('freshbite_orders', AppState.orders);
    setStorage('freshbite_credits', AppState.user.credits);
    setStorage('freshbite_addresses', AppState.user.addresses);
    this.updateBadges();
  },

  updateBadges() {
    const cartCount = AppState.cart.reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
    $$('.cart-count-badge').forEach(b => {
      b.textContent = cartCount;
      b.style.display = cartCount > 0 ? 'flex' : 'none';
    });

    $$('.wishlist-count-badge').forEach(b => {
      b.textContent = AppState.wishlist.length;
      b.style.display = AppState.wishlist.length > 0 ? 'flex' : 'none';
    });

    const creditsEl = $('navCreditsCount');
    if (creditsEl) creditsEl.textContent = `${AppState.user.credits} pts`;
  },

  // Central Bill Calculation (used in Cart, Checkout & Orders)
  getBillDetails() {
    const subtotal = AppState.cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0);
    const discount = Math.round(this.calculateDiscount(subtotal, AppState.appliedPromo));
    const subtotalAfterCoupon = Math.max(0, subtotal - discount);
    const creditsDiscount = Math.min(AppState.appliedCredits, subtotalAfterCoupon, AppState.user.credits);
    AppState.appliedCredits = creditsDiscount;

    const gst = Math.round(subtotal * 0.05);
    const tip = subtotal > 0 ? AppState.tip : 0;
    const total = Math.max(0, Math.round(subtotalAfterCoupon - creditsDiscount + gst + tip));
    const earnCredits = Math.max(10, Math.round(total * 0.10));

    return {
      subtotal,
      discount,
      subtotalAfterCoupon,
      creditsDiscount,
      gst,
      tip,
      total,
      earnCredits,
      isQualified: Boolean(AppState.appliedPromo) && (!AppState.appliedPromo.minOrder || subtotal >= AppState.appliedPromo.minOrder)
    };
  },

  calculateDiscount(subtotal, promo) {
    if (!promo || !subtotal || subtotal <= 0) return 0;
    if (promo.minOrder && subtotal < promo.minOrder) return 0;
    if (promo.flat) return Math.min(subtotal, promo.discount);
    const calc = subtotal * promo.discount;
    return promo.max ? Math.min(calc, promo.max) : calc;
  },

  // Views & Listings
  renderHome() {
    const grid = $('featuredDishesGrid');
    if (!grid) return;
    const featured = DISHES.filter(d => d.isFeatured).slice(0, 4);
    grid.innerHTML = featured.map(d => this.createDishCardHTML(d)).join('');
  },

  renderRestaurants() {
    const grid = $('restaurantsGrid');
    if (!grid) return;
    grid.innerHTML = RESTAURANTS.map(r => `
      <div class="restaurant-card" onclick="FreshBite.filterByRestaurant('${r.id}')">
        <div class="card-img-wrap">
          <img src="${r.image}" alt="${r.name}" loading="lazy">
          <span class="card-badge">⭐ ${r.rating} (${r.reviewsCount})</span>
        </div>
        <div class="card-content">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.35rem;">
            <span style="font-size:0.75rem;font-weight:700;color:var(--primary);">${r.cuisineLabel}</span>
            <span style="font-size:0.75rem;color:var(--text-muted);">${r.priceTier}</span>
          </div>
          <h3 class="card-title">${r.name}</h3>
          <p class="card-desc">${r.tagline}</p>
          <div class="card-bottom">
            <span style="font-size:0.85rem;color:var(--text-brown);font-weight:600;">⚡ ${r.deliveryTime}</span>
            <button class="btn-cta-secondary" style="font-size:0.82rem;padding:0.4rem 0.8rem;color:var(--text-brown);">View Dishes →</button>
          </div>
        </div>
      </div>
    `).join('');
  },

  filterByRestaurant(restId) {
    this.navigate('menu');
    AppState.categoryFilter = 'all';
    AppState.searchQuery = '';
    AppState.dietaryFilter = 'all';
    this.renderMenuFiltered(restId);
  },

  renderMenu() {
    this.renderMenuFiltered();
  },

  renderMenuFiltered(restIdFilter = null) {
    const container = $('menuDishesGrid');
    if (!container) return;

    let items = DISHES;
    if (restIdFilter) items = items.filter(d => d.restaurantId === restIdFilter);
    if (AppState.dietaryFilter !== 'all') items = items.filter(d => d.dietary.includes(AppState.dietaryFilter));
    if (AppState.categoryFilter !== 'all') items = items.filter(d => d.category === AppState.categoryFilter);

    if (AppState.searchQuery.trim()) {
      const q = AppState.searchQuery.toLowerCase();
      items = items.filter(d => d.name.toLowerCase().includes(q) || d.ingredients.some(i => i.toLowerCase().includes(q)));
    }

    if (!items.length) {
      container.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:3rem;background:var(--bg-card);border-radius:var(--radius-md);">
          <div style="font-size:3rem;margin-bottom:0.5rem;">🍛</div>
          <h3>No matching Indian dishes found</h3>
          <p style="color:var(--text-muted);margin-top:0.5rem;">Try clearing your filters or searching for another dish.</p>
          <button class="btn-cta" style="margin-top:1rem;" onclick="FreshBite.resetFilters()">Show All Dishes</button>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(d => this.createDishCardHTML(d)).join('');
  },

  resetFilters() {
    AppState.dietaryFilter = 'all';
    AppState.categoryFilter = 'all';
    AppState.searchQuery = '';
    const input = $('menuSearchInput');
    if (input) input.value = '';

    $$('.dietary-filter-chip').forEach(c => c.classList.toggle('active', c.dataset.diet === 'all'));
    $$('.cat-filter-chip').forEach(c => c.classList.toggle('active', c.dataset.cat === 'all'));
    this.renderMenuFiltered();
  },

  createDishCardHTML(dish) {
    const isSaved = AppState.wishlist.includes(dish.id);
    const cartItem = AppState.cart.find(i => i.id === dish.id);
    const qty = cartItem ? cartItem.qty : 0;
    const isVeg = dish.dietary.includes('veg');

    return `
      <div class="dish-card" data-dish-id="${dish.id}">
        <div class="card-img-wrap" onclick="FreshBite.openProductModal('${dish.id}')">
          <img src="${dish.image}" alt="${dish.name}" loading="lazy">
          <button class="wishlist-btn ${isSaved ? 'active' : ''}" onclick="event.stopPropagation(); FreshBite.toggleWishlist('${dish.id}')" title="Save to wishlist">
            ${isSaved ? '❤️' : '🤍'}
          </button>
          <span class="card-badge">⭐ ${dish.rating}</span>
        </div>
        <div class="card-content">
          <div class="dietary-tags">
            <span class="dietary-pill ${isVeg ? 'veg' : 'non-veg'}">
              ${isVeg ? '🥬 Pure Veg' : '🍗 Non-Veg'}
            </span>
            ${dish.dietary.includes('gluten-free') ? '<span class="dietary-pill veg">🌾 Gluten-Free</span>' : ''}
            ${dish.dietary.includes('vegan') ? '<span class="dietary-pill veg">🌱 Vegan</span>' : ''}
          </div>
          <h3 class="card-title" onclick="FreshBite.openProductModal('${dish.id}')">${dish.name}</h3>
          <p class="card-desc">${dish.description.substring(0, 92)}...</p>
          <div class="card-bottom">
            <span class="card-price">₹${dish.price}</span>
            ${qty > 0 ? `
              <div class="qty-stepper">
                <button class="qty-btn" onclick="FreshBite.updateCartQty('${dish.id}', -1)" title="Decrease quantity">−</button>
                <span class="qty-num">${qty}</span>
                <button class="qty-btn" onclick="FreshBite.updateCartQty('${dish.id}', 1)" title="Increase quantity">+</button>
              </div>
            ` : `
              <button class="add-btn" onclick="FreshBite.addToCart('${dish.id}')">+ Add</button>
            `}
          </div>
        </div>
      </div>
    `;
  },

  openProductModal(dishId) {
    const dish = DISHES.find(d => d.id === dishId);
    const modal = $('productModal');
    const container = $('productModalContent');
    if (!dish || !modal || !container) return;

    const isSaved = AppState.wishlist.includes(dish.id);
    const isVeg = dish.dietary.includes('veg');

    container.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;">
        <div>
          <img src="${dish.image}" alt="${dish.name}" style="width:100%;height:260px;object-fit:cover;border-radius:var(--radius-md);">
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:0.5rem;margin-top:1rem;background:var(--bg-cream);padding:0.75rem;border-radius:var(--radius-sm);text-align:center;">
            <div><small style="color:var(--text-muted);display:block;font-size:0.75rem;">Calories</small><strong>${dish.nutrition.calories}</strong></div>
            <div><small style="color:var(--text-muted);display:block;font-size:0.75rem;">Protein</small><strong>${dish.nutrition.protein}</strong></div>
            <div><small style="color:var(--text-muted);display:block;font-size:0.75rem;">Carbs</small><strong>${dish.nutrition.carbs}</strong></div>
            <div><small style="color:var(--text-muted);display:block;font-size:0.75rem;">Fat</small><strong>${dish.nutrition.fat}</strong></div>
          </div>
        </div>
        <div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.5rem;">
            <span class="dietary-pill ${isVeg ? 'veg' : 'non-veg'}">${isVeg ? '🥬 Pure Vegetarian' : '🍗 Non-Vegetarian'}</span>
            <button class="action-btn" onclick="FreshBite.toggleWishlist('${dish.id}'); FreshBite.openProductModal('${dish.id}');" style="padding:0.3rem 0.6rem;font-size:0.85rem;">
              ${isSaved ? '❤️ Saved' : '🤍 Save'}
            </button>
          </div>
          <h2 style="font-size:1.45rem;margin-bottom:0.35rem;">${dish.name}</h2>
          <div style="color:var(--primary-hover);font-size:1.35rem;font-weight:800;margin-bottom:0.75rem;">₹${dish.price}</div>
          <p style="color:var(--text-muted);font-size:0.9rem;line-height:1.6;margin-bottom:1rem;">${dish.description}</p>
          <h4 style="font-size:0.95rem;margin-bottom:0.4rem;">Key Ingredients:</h4>
          <div style="display:flex;flex-wrap:wrap;gap:0.35rem;margin-bottom:1rem;">
            ${dish.ingredients.map(ing => `<span class="coupon-chip">${ing}</span>`).join('')}
          </div>
          <h4 style="font-size:0.95rem;margin-bottom:0.4rem;">Foodie Reviews:</h4>
          <div style="background:var(--bg-cream);padding:0.75rem;border-radius:var(--radius-sm);font-size:0.85rem;font-style:italic;color:var(--text-brown);margin-bottom:1.25rem;">
            ${dish.reviews[0] || 'Deliciously prepared with authentic Indian spices!'}
          </div>
          <button class="btn-cta" style="width:100%;" onclick="FreshBite.addToCart('${dish.id}'); FreshBite.closeModal('productModal'); FreshBite.openCart();">Add to Cart 🛒</button>
        </div>
      </div>
    `;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  // Cart Management
  openCart() {
    this.renderCart();
    $('cartDrawer')?.classList.add('active');
    $('cartOverlay')?.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  closeCart() {
    $('cartDrawer')?.classList.remove('active');
    $('cartOverlay')?.classList.remove('active');
    if (!$$('.modal-overlay.active').length) {
      document.body.style.overflow = '';
    }
  },

  addToCart(dishId) {
    const dish = DISHES.find(d => d.id === dishId);
    if (!dish) return;

    const existing = AppState.cart.find(i => i.id === dishId);
    if (existing) {
      existing.qty += 1;
    } else {
      AppState.cart.push({ id: dish.id, name: dish.name, price: dish.price, image: dish.image, qty: 1 });
    }

    this.saveState();
    this.renderHome();
    this.renderMenuFiltered();
    this.renderCart();
    this.showToast(`Added "${dish.name}" to cart! 🍛`);
  },

  updateCartQty(dishId, delta) {
    const item = AppState.cart.find(i => i.id === dishId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      this.removeFromCart(dishId);
      return;
    }

    this.saveState();
    this.renderHome();
    this.renderMenuFiltered();
    this.renderCart();
  },

  removeFromCart(dishId) {
    const item = AppState.cart.find(i => i.id === dishId);
    AppState.cart = AppState.cart.filter(i => i.id !== dishId);
    this.saveState();
    this.renderHome();
    this.renderMenuFiltered();
    this.renderCart();
    this.showToast(`Removed "${item ? item.name : 'dish'}" from cart`);
  },

  renderCart() {
    const body = $('cartDrawerBody') || $('cartItemsContainer');
    const footer = $('cartDrawerFooter') || $('cartFooter');
    if (!body) return;

    if (!AppState.cart.length) {
      body.innerHTML = `
        <div style="text-align:center;padding:3rem 1rem;">
          <div style="font-size:3.5rem;margin-bottom:0.75rem;">🍱</div>
          <h3 style="font-size:1.3rem;margin-bottom:0.4rem;color:var(--text-brown);">Your cart is empty</h3>
          <p style="color:var(--text-muted);font-size:0.9rem;margin-top:0.4rem;line-height:1.5;">Explore authentic Indian delicacies and add items to your thaali!</p>
          <button class="btn-cta" style="margin-top:1.25rem;" onclick="FreshBite.closeCart(); FreshBite.navigate('menu');">Explore Dishes 🍛</button>
        </div>
      `;
      if (footer) footer.style.display = 'none';
      return;
    }

    if (footer) footer.style.display = 'block';

    body.innerHTML = AppState.cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">₹${item.price} each</div>
          <div class="qty-stepper">
            <button class="qty-btn" onclick="FreshBite.updateCartQty('${item.id}', -1)" title="Decrease quantity">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="FreshBite.updateCartQty('${item.id}', 1)" title="Increase quantity">+</button>
          </div>
        </div>
        <div style="text-align:right;">
          <strong style="color:var(--text-brown);font-size:1.05rem;">₹${item.price * item.qty}</strong>
          <button class="cart-remove-btn" onclick="FreshBite.removeFromCart('${item.id}')" title="Remove item">✕</button>
        </div>
      </div>
    `).join('');

    const bill = this.getBillDetails();
    const promoBox = $('cartPromoContainer') || $('cartPromoSection');
    if (promoBox) {
      if (AppState.appliedPromo) {
        promoBox.innerHTML = `
          <div class="active-coupon-badge">
            <div style="display:flex;align-items:center;gap:0.4rem;">
              <span style="font-size:1.2rem;">🏷️</span>
              <div>
                <strong style="color:#166534;font-size:0.88rem;display:block;">${AppState.appliedPromo.code} APPLIED</strong>
                <span style="font-size:0.75rem;color:${bill.isQualified ? '#15803D' : '#D97706'};">
                  ${bill.isQualified ? AppState.appliedPromo.desc : `⚠️ Add ₹${AppState.appliedPromo.minOrder - bill.subtotal} more to qualify`}
                </span>
              </div>
            </div>
            <button class="remove-coupon-btn" onclick="FreshBite.removePromoCode()" title="Remove coupon">✕ Remove</button>
          </div>
        `;
      } else {
        promoBox.innerHTML = `
          <div class="coupon-input-wrap">
            <input type="text" id="promoCodeInput" placeholder="Enter coupon (e.g. FRESH50)" onkeypress="if(event.key==='Enter') FreshBite.applyPromoCode()">
            <button class="add-btn" style="padding:0.45rem 1rem;" onclick="FreshBite.applyPromoCode()">Apply</button>
          </div>
          <div class="coupon-chips-list">
            <span class="coupon-chip" onclick="FreshBite.applyPromoCode('FRESH50')">🏷️ FRESH50</span>
            <span class="coupon-chip" onclick="FreshBite.applyPromoCode('BITE20')">🎉 BITE20</span>
            <span class="coupon-chip" onclick="FreshBite.applyPromoCode('DESI100')">🍛 DESI100</span>
          </div>
        `;
      }
    }

    if ($('cartSubtotal')) $('cartSubtotal').textContent = `₹${bill.subtotal}`;
    if ($('cartDiscount')) {
      $('cartDiscount').textContent = bill.discount > 0 ? `-₹${bill.discount}` : '₹0';
      $('cartDiscount').style.color = bill.discount > 0 ? 'var(--success)' : 'var(--text-muted)';
    }
    if ($('cartCreditsRow') && $('cartCreditsDiscount')) {
      $('cartCreditsRow').style.display = bill.creditsDiscount > 0 ? 'flex' : 'none';
      $('cartCreditsDiscount').textContent = `-₹${bill.creditsDiscount}`;
    }
    if ($('cartTotal')) $('cartTotal').textContent = `₹${bill.total}`;

    if ($('checkoutModal')?.classList.contains('active')) {
      this.renderCheckoutSummary();
    }
  },

  // Promo Code Engine
  applyPromoCode(explicitCode) {
    let code = explicitCode || $('promoCodeInput')?.value || $('checkoutPromoInput')?.value;
    code = (code || '').trim().toUpperCase();

    if (!code) return this.showToast('Please enter a coupon code! (e.g. FRESH50)');

    const promo = PROMO_CODES[code];
    if (!promo) return this.showToast(`Invalid coupon "${code}". Try FRESH50, BITE20 or DESI100! ❌`);

    const subtotal = AppState.cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.qty)), 0);
    AppState.appliedPromo = { code, ...promo };

    if (promo.minOrder && subtotal < promo.minOrder) {
      this.showToast(`Coupon "${code}" applied! Add ₹${promo.minOrder - subtotal} more to qualify for discount.`);
    } else {
      this.showToast(`Coupon "${code}" applied successfully! 🎉`);
    }

    this.renderCart();
    this.renderCheckoutSummary();
  },

  removePromoCode() {
    if (!AppState.appliedPromo) return;
    const code = AppState.appliedPromo.code;
    AppState.appliedPromo = null;
    this.showToast(`Coupon "${code}" removed`);
    this.renderCart();
    this.renderCheckoutSummary();
  },

  quickApplyPromo(code) {
    this.applyPromoCode(code);
    this.openCart();
  },

  // FreshCredits (Play Store Rewards) Logic
  applyCredits() {
    if (AppState.user.credits <= 0) return this.showToast('You have 0 FreshCredits to redeem!');
    const { subtotalAfterCoupon } = this.getBillDetails();
    if (subtotalAfterCoupon <= 0) return this.showToast('Your order total is already ₹0 with the coupon discount!');

    AppState.appliedCredits = Math.min(AppState.user.credits, subtotalAfterCoupon);
    this.showToast(`Redeemed ${AppState.appliedCredits} FreshCredits (-₹${AppState.appliedCredits})! 🪙`);
    this.renderCart();
    this.renderCheckoutSummary();
  },

  removeCredits() {
    if (AppState.appliedCredits <= 0) return;
    AppState.appliedCredits = 0;
    this.showToast('FreshCredits removed');
    this.renderCart();
    this.renderCheckoutSummary();
  },

  // Address Management
  populateCheckoutAddresses() {
    const select = $('checkoutAddressSelect');
    if (!select) return;
    
    AppState.user.addresses = normalizeAddresses(AppState.user.addresses);
    AppState.selectedAddress = sanitizeAddress(AppState.selectedAddress);
    if (!AppState.selectedAddress || !AppState.user.addresses.includes(AppState.selectedAddress)) {
      AppState.selectedAddress = AppState.user.addresses[0] || DEFAULT_ADDRESSES[0];
    }

    select.innerHTML = AppState.user.addresses.map(a => {
      const clean = sanitizeAddress(a);
      const isSelected = AppState.selectedAddress === clean;
      return `<option value="${clean.replace(/"/g, '&quot;')}" ${isSelected ? 'selected' : ''}>${clean}</option>`;
    }).join('') + `<option value="ADD_NEW">➕ Add New Delivery Address...</option>`;
  },

  onAddressSelectChange(val) {
    if (val === 'ADD_NEW') {
      this.toggleNewAddressForm(true);
    } else {
      const clean = sanitizeAddress(val) || AppState.user.addresses[0] || DEFAULT_ADDRESSES[0];
      AppState.selectedAddress = clean;
      this.toggleNewAddressForm(false);
      const tagLabel = clean.split('—')[0]?.trim() || 'Address';
      this.showToast(`Selected: ${tagLabel} 📍`);
    }
  },

  selectSavedAddress(index) {
    AppState.user.addresses = normalizeAddresses(AppState.user.addresses);
    if (AppState.user.addresses[index]) {
      AppState.selectedAddress = AppState.user.addresses[index];
      this.saveState();
      this.populateCheckoutAddresses();
      this.switchAccountTab('addresses');
      this.showToast('Selected as default address! 📍');
    }
  },

  toggleNewAddressForm(force) {
    const wrap = $('inlineAddressFormWrap');
    if (!wrap) return;
    const show = force !== undefined ? force : wrap.style.display === 'none';
    wrap.style.display = show ? 'block' : 'none';
    if (show) $('newAddressFlat')?.focus();
  },

  toggleAccountAddressForm(force) {
    const wrap = $('accountAddressFormWrap');
    if (!wrap) return;
    const show = force !== undefined ? force : wrap.style.display === 'none';
    wrap.style.display = show ? 'block' : 'none';
    if (show) $('accAddressFlat')?.focus();
  },

  selectAddressTag(btn, tag) {
    AppState.selectedAddressTag = tag;
    $$('.address-tag-btn').forEach(b => b.classList.toggle('active', b.dataset.tag === tag));
  },

  saveNewAddress(fromAccount = false) {
    const tag = AppState.selectedAddressTag || '🏠 Home';
    const isAccount = typeof fromAccount === 'boolean' && fromAccount;
    const p = isAccount ? 'accAddress' : 'newAddress';
    const flat = $(p + 'Flat')?.value?.trim();
    const area = $(p + 'Area')?.value?.trim();
    const city = $(p + 'City')?.value?.trim() || 'Bengaluru';
    const pin = $(p + 'Pincode')?.value?.trim() || '560100';

    if (!flat || !area) return this.showToast('Please enter Flat/House No. and Street/Area! 📍');

    const addr = `${tag} — ${flat}, ${area}, ${city} - ${pin}`;
    const cleanAddr = sanitizeAddress(addr);
    AppState.user.addresses.unshift(cleanAddr);
    AppState.selectedAddress = cleanAddr;
    this.saveState();
    this.populateCheckoutAddresses();
    this.showToast('New delivery address saved & selected! 📍');

    if ($(p + 'Flat')) $(p + 'Flat').value = '';
    if ($(p + 'Area')) $(p + 'Area').value = '';

    if (isAccount) {
      this.switchAccountTab('addresses');
    } else {
      this.toggleNewAddressForm(false);
    }
  },

  removeAddress(index) {
    AppState.user.addresses = normalizeAddresses(AppState.user.addresses);
    if (AppState.user.addresses.length <= 1) {
      return this.showToast('You must keep at least one saved delivery address.');
    }
    AppState.user.addresses.splice(index, 1);
    AppState.selectedAddress = AppState.user.addresses[0] || DEFAULT_ADDRESSES[0];
    this.saveState();
    this.populateCheckoutAddresses();
    this.switchAccountTab('addresses');
    this.showToast('Address removed 🗑️');
  },

  // Checkout Operations
  openCheckout() {
    if (!AppState.cart.length) return this.showToast('Your cart is empty!');
    this.closeCart();
    this.populateCheckoutAddresses();
    this.renderCheckoutSummary();
    this.selectDeliverySlot(AppState.deliverySlot || '⚡ Lightning Express (25-35 min)');
    this.selectPaymentMethod(AppState.paymentMethod || 'upi');
    $('checkoutModal')?.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  renderCheckoutSummary() {
    const wrap = $('checkoutBillSummaryWrap');
    if (!wrap) return;
    const bill = this.getBillDetails();
    const count = AppState.cart.reduce((s, i) => s + i.qty, 0);

    wrap.innerHTML = `
      <div class="checkout-summary-card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;padding-bottom:0.5rem;border-bottom:1px solid var(--border);">
          <strong style="color:var(--text-brown);font-size:0.95rem;">Order Bill Breakdown (${count} items)</strong>
          <span style="font-size:0.8rem;color:var(--text-muted);">${AppState.deliveryPartner.name} delivering</span>
        </div>

        <div style="margin-bottom:0.75rem;">
          ${AppState.appliedPromo ? `
            <div class="active-coupon-badge" style="margin-bottom:0;">
              <div style="display:flex;align-items:center;gap:0.4rem;">
                <span style="font-size:1.1rem;">🏷️</span>
                <div>
                  <strong style="color:#166534;font-size:0.85rem;">${AppState.appliedPromo.code} APPLIED</strong>
                  <span style="font-size:0.74rem;color:${bill.isQualified ? '#15803D' : '#D97706'};display:block;">
                    ${bill.isQualified ? AppState.appliedPromo.desc : `⚠️ Add ₹${AppState.appliedPromo.minOrder - bill.subtotal} more to qualify`}
                  </span>
                </div>
              </div>
              <button class="remove-coupon-btn" onclick="FreshBite.removePromoCode()" title="Remove coupon">✕ Remove</button>
            </div>
          ` : `
            <div class="coupon-input-wrap">
              <input type="text" id="checkoutPromoInput" placeholder="Have a coupon? (e.g. FRESH50)" onkeypress="if(event.key==='Enter') FreshBite.applyPromoCode(this.value)">
              <button class="add-btn" style="padding:0.45rem 0.9rem;" onclick="FreshBite.applyPromoCode($('checkoutPromoInput').value)">Apply</button>
            </div>
            <div class="coupon-chips-list" style="margin-top:0.4rem;margin-bottom:0;">
              <span class="coupon-chip" onclick="FreshBite.applyPromoCode('FRESH50')">🏷️ FRESH50</span>
              <span class="coupon-chip" onclick="FreshBite.applyPromoCode('BITE20')">🎉 BITE20</span>
              <span class="coupon-chip" onclick="FreshBite.applyPromoCode('DESI100')">🍛 DESI100</span>
            </div>
          `}
        </div>

        <div class="credits-redeem-card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:0.45rem;">
              <span style="font-size:1.3rem;">🪙</span>
              <div>
                <strong style="color:#92400E;font-size:0.88rem;">FreshCredits: ${AppState.user.credits} pts</strong>
                <span style="font-size:0.74rem;color:#B45309;display:block;">1 Pt = ₹1 discount • Earn +${bill.earnCredits} pts on this order</span>
              </div>
            </div>
            ${bill.creditsDiscount > 0 ? `
              <button class="remove-coupon-btn" onclick="FreshBite.removeCredits()">✕ Remove</button>
            ` : `
              <button class="add-btn" style="padding:0.35rem 0.85rem;font-size:0.78rem;background:#D97706;" onclick="FreshBite.applyCredits()" ${AppState.user.credits <= 0 || bill.subtotalAfterCoupon <= 0 ? 'disabled style="opacity:0.5;"' : ''}>
                Redeem Credits
              </button>
            `}
          </div>
          ${bill.creditsDiscount > 0 ? `
            <div style="font-size:0.78rem;color:#166534;font-weight:700;margin-top:0.4rem;background:#DCFCE7;padding:0.35rem 0.6rem;border-radius:4px;display:flex;justify-content:space-between;">
              <span>✓ Redeemed ${bill.creditsDiscount} FreshCredits</span>
              <span>-₹${bill.creditsDiscount} Instant OFF</span>
            </div>
          ` : ''}
        </div>

        <div style="font-size:0.85rem;display:flex;justify-content:space-between;margin-bottom:0.35rem;color:var(--text-brown);">
          <span>Items Total:</span>
          <strong>₹${bill.subtotal}</strong>
        </div>
        ${bill.discount > 0 ? `
          <div style="font-size:0.85rem;display:flex;justify-content:space-between;margin-bottom:0.35rem;color:var(--success);">
            <span>Coupon (${AppState.appliedPromo.code}):</span>
            <strong>-₹${bill.discount}</strong>
          </div>
        ` : ''}
        ${bill.creditsDiscount > 0 ? `
          <div style="font-size:0.85rem;display:flex;justify-content:space-between;margin-bottom:0.35rem;color:#D97706;font-weight:700;">
            <span>Credits Redeemed (🪙 ${bill.creditsDiscount} pts):</span>
            <strong>-₹${bill.creditsDiscount}</strong>
          </div>
        ` : ''}
        <div style="font-size:0.85rem;display:flex;justify-content:space-between;margin-bottom:0.35rem;color:var(--text-muted);">
          <span>GST (5%) & Eco Packaging:</span>
          <span>₹${bill.gst}</span>
        </div>
        <div style="font-size:0.85rem;display:flex;justify-content:space-between;margin-bottom:0.6rem;color:var(--text-muted);">
          <span>Delivery Partner Tip (${AppState.deliveryPartner.name.split(' ')[0]}):</span>
          <span>₹${bill.tip}</span>
        </div>

        <div style="font-size:1.15rem;display:flex;justify-content:space-between;border-top:1px dashed var(--border);padding-top:0.6rem;color:var(--text-brown);">
          <strong>To Pay:</strong>
          <strong style="color:var(--primary-hover);">₹${bill.total}</strong>
        </div>

        <div style="margin-top:0.6rem;background:#FEF3C7;border:1px dashed #F59E0B;border-radius:4px;padding:0.4rem 0.6rem;font-size:0.76rem;color:#92400E;display:flex;align-items:center;gap:0.35rem;">
          <span>🎉</span>
          <span>You will earn <strong>+${bill.earnCredits} FreshCredits</strong> on this order!</span>
        </div>
      </div>
    `;

    this.updateCheckoutButton(bill.total);
  },

  updateCheckoutButton(totalAmount) {
    const btn = $('placeOrderSubmitBtn');
    if (!btn) return;
    const finalTotal = totalAmount !== undefined ? totalAmount : this.getBillDetails().total;
    const labels = {
      upi: `Pay ₹${finalTotal} via UPI & Track Live (Vikram Sharma 🛵)`,
      card: `Pay ₹${finalTotal} via RuPay Card & Track Live (Vikram Sharma 🛵)`,
      cod: `Confirm COD Order (₹${finalTotal}) & Track Live (Vikram Sharma 🛵)`
    };
    btn.textContent = labels[AppState.paymentMethod] || labels.upi;
  },

  // Delivery Time Scheduling (Strict 30-Min Minimum Rule)
  getMinDeliveryTime() {
    const minDelivery = new Date(Date.now() + 30 * 60 * 1000);
    const h = String(minDelivery.getHours()).padStart(2, '0');
    const m = String(minDelivery.getMinutes()).padStart(2, '0');
    return {
      timeStr: `${h}:${m}`,
      dateObj: minDelivery,
      displayStr: this.formatTime12Hour(minDelivery.getHours(), minDelivery.getMinutes())
    };
  },

  formatTime12Hour(hour, minute) {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h}:${String(minute).padStart(2, '0')} ${ampm}`;
  },

  initCustomTimePicker() {
    const min = this.getMinDeliveryTime();
    const input = $('customDeliveryTimeInput');
    const badge = $('customTimeEarliestBadge');
    if (badge) badge.textContent = `Earliest: ${min.displayStr} (Min 30 min)`;
    if (input) {
      input.min = min.timeStr;
      if (!input.value) {
        input.value = min.timeStr;
      } else {
        const [h, m] = input.value.split(':').map(Number);
        const test = new Date();
        test.setHours(h, m, 0, 0);
        if (test < min.dateObj) input.value = min.timeStr;
      }
    }
  },

  setCustomDeliveryOffset(minutes) {
    const target = new Date(Date.now() + Math.max(30, minutes) * 60 * 1000);
    const h = String(target.getHours()).padStart(2, '0');
    const m = String(target.getMinutes()).padStart(2, '0');
    const timeStr = `${h}:${m}`;
    const input = $('customDeliveryTimeInput');
    if (input) input.value = timeStr;
    this.onCustomTimeChange(timeStr);
  },

  selectDeliverySlot(slot) {
    const customWrap = $('customTimePickerWrap');
    if (slot === 'custom') {
      if (customWrap) customWrap.style.display = 'block';
      this.initCustomTimePicker();
      const input = $('customDeliveryTimeInput');
      if (input) this.onCustomTimeChange(input.value);
    } else {
      if (customWrap) customWrap.style.display = 'none';
      AppState.deliverySlot = slot;
      this.showToast(`Delivery slot: ${slot}`);
    }
    $$('.slot-card').forEach(c => c.classList.toggle('active', c.dataset.slot === slot));
  },

  onCustomTimeChange(val) {
    if (!val) return;
    const [h, m] = val.split(':').map(Number);
    const selected = new Date();
    selected.setHours(h, m, 0, 0);

    const min = this.getMinDeliveryTime();
    if (selected < min.dateObj) {
      const input = $('customDeliveryTimeInput');
      if (input) input.value = min.timeStr;
      AppState.deliverySlot = `🕒 Custom Delivery at ${min.displayStr} (Min 30m)`;
      this.showToast(`⚠️ Minimum 30 mins required for cooking! Adjusted to ${min.displayStr}.`);
    } else {
      const formatted = this.formatTime12Hour(h, m);
      AppState.deliverySlot = `🕒 Custom Delivery at ${formatted}`;
      this.showToast(`Delivery scheduled for ${formatted}! ⏰`);
    }
  },

  // Payment Selection
  selectPaymentMethod(method) {
    AppState.paymentMethod = method;
    $$('.payment-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.method === method));
    const views = { upi: $('payContentUPI'), card: $('payContentCard'), cod: $('payContentCOD') };
    Object.keys(views).forEach(k => {
      if (views[k]) views[k].style.display = k === method ? 'block' : 'none';
    });
    this.updateCheckoutButton();
    const names = { upi: 'Instant UPI / QR Auto-Pay', card: 'RuPay / Debit Card', cod: 'Cash on Delivery (COD)' };
    this.showToast(`Payment method: ${names[method] || method}`);
  },

  onCardInput(val) {
    const digits = (val || '').replace(/\D/g, '').substring(0, 16);
    const formatted = digits.replace(/(\d{4})/g, '$1 ').trim();
    const preview = $('cardPreviewNumber');
    if (preview) preview.textContent = formatted || '•••• •••• •••• 5521';
  },

  // Order Placement
  placeOrder() {
    if (!AppState.cart.length) return this.showToast('Your cart is empty! Please add dishes to continue.');
    const bill = this.getBillDetails();
    AppState.user.credits = Math.max(0, AppState.user.credits - bill.creditsDiscount) + bill.earnCredits;

    const selectEl = $('checkoutAddressSelect');
    let selectedAddr = AppState.selectedAddress;
    if (!selectedAddr || selectedAddr === 'ADD_NEW' || selectedAddr.includes('[object')) {
      if (selectEl && selectEl.value && selectEl.value !== 'ADD_NEW' && !selectEl.value.includes('[object')) {
        selectedAddr = selectEl.value;
      } else {
        selectedAddr = AppState.user.addresses[0] || DEFAULT_ADDRESSES[0];
      }
    }
    selectedAddr = sanitizeAddress(selectedAddr) || DEFAULT_ADDRESSES[0];
    AppState.selectedAddress = selectedAddr;

    const newOrder = {
      id: 'FB-IN-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      items: [...AppState.cart],
      total: bill.total,
      subtotal: bill.subtotal,
      appliedCoupon: AppState.appliedPromo ? AppState.appliedPromo.code : null,
      discount: bill.discount,
      redeemedCredits: bill.creditsDiscount,
      earnedCredits: bill.earnCredits,
      deliveryAddress: selectedAddr,
      status: 'Placed',
      paymentMethod: AppState.paymentMethod || 'upi',
      slot: AppState.deliverySlot || '⚡ Lightning Express (25-35 min)',
      driver: AppState.deliveryPartner.name
    };

    AppState.orders.unshift(newOrder);
    AppState.cart = [];
    AppState.appliedPromo = null;
    AppState.appliedCredits = 0;

    this.saveState();
    this.renderCart();
    this.updateBadges();
    this.closeModal('checkoutModal');
    this.openTrackingModal(newOrder.id);
    this.showToast(`Dhanyavaad! Order placed. You earned +${bill.earnCredits} FreshCredits 🪙!`);
  },

  // Live Order Tracking Simulation
  openTrackingModal(orderId) {
    const order = AppState.orders.find(o => o.id === orderId) || AppState.orders[0];
    const modal = $('trackingModal');
    const container = $('trackingModalContent');
    if (!order || !modal || !container) return;

    const partner = AppState.deliveryPartner;
    const cleanAddress = sanitizeAddress(order.deliveryAddress) || sanitizeAddress(AppState.selectedAddress) || DEFAULT_ADDRESSES[0];
    container.innerHTML = `
      <div style="text-align:center;margin-bottom:1.5rem;">
        <span class="hero-badge">🛵 Order ID: ${order.id}</span>
        <h2 style="font-size:1.6rem;margin-top:0.4rem;">Live Delivery Simulation</h2>
        <p style="color:var(--text-muted);font-size:0.9rem;">Estimated Arrival: <strong>${order.slot}</strong></p>
        <p style="font-size:0.82rem;color:var(--text-brown);margin-top:2px;">Delivering to: <strong>${cleanAddress}</strong></p>
        ${order.earnedCredits ? `<div style="font-size:0.8rem;color:#92400E;background:#FEF3C7;display:inline-block;padding:2px 10px;border-radius:999px;margin-top:4px;font-weight:700;">🪙 +${order.earnedCredits} FreshCredits Earned</div>` : ''}
      </div>

      <div class="stepper-wrap">
        <div class="stepper-progress-line" id="trackingLine" style="width: 25%;"></div>
        <div class="step-node done" id="step1"><div class="step-dot">✓</div><span>Order Placed</span></div>
        <div class="step-node active" id="step2"><div class="step-dot">2</div><span>Accepted</span></div>
        <div class="step-node" id="step3"><div class="step-dot">3</div><span>Cooking</span></div>
        <div class="step-node" id="step4"><div class="step-dot">4</div><span>Out for Delivery</span></div>
        <div class="step-node" id="step5"><div class="step-dot">5</div><span>Delivered</span></div>
      </div>

      <div style="background:var(--bg-cream);border:1px solid var(--border);border-radius:var(--radius-md);padding:1.25rem;display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Indian Delivery Partner" style="width:54px;height:54px;border-radius:50%;object-fit:cover;border:2px solid var(--primary);">
        <div style="flex:1;">
          <h4 style="font-size:1rem;margin-bottom:2px;">${partner.name} (Delivery Partner)</h4>
          <p style="font-size:0.82rem;color:var(--text-muted);">⭐ ${partner.rating} Rating • ${partner.vehicle}</p>
        </div>
        <button class="action-btn" onclick="FreshBite.showToast('Calling ${partner.name}... Connected! 📞')">📞 Call</button>
      </div>

      <div style="display:flex;gap:0.75rem;">
        <button class="btn-cta" style="flex:1;" onclick="FreshBite.advanceTrackingStage()">⚡ Fast-Forward Stage</button>
        <button class="btn-cta-secondary" style="color:var(--text-brown);" onclick="FreshBite.closeModal('trackingModal')">Done</button>
      </div>
    `;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  advanceTrackingStage() {
    const line = $('trackingLine');
    if (!line) return;
    const current = parseInt(line.style.width || '25', 10);
    if (current < 100) {
      const next = current + 25;
      line.style.width = `${next}%`;
      const stepNum = next / 25 + 1;
      for (let i = 1; i <= 5; i++) {
        const step = $(`step${i}`);
        if (!step) continue;
        if (i < stepNum) {
          step.className = 'step-node done';
          step.querySelector('.step-dot').textContent = '✓';
        } else if (i === stepNum) {
          step.className = 'step-node active';
        } else {
          step.className = 'step-node';
        }
      }
      this.showToast(next === 100 ? 'Order delivered! Savor the authentic Indian feast! 🍛' : 'Order progressed to next stage! 🛵');
    }
  },

  // Wishlist Actions
  toggleWishlist(dishId) {
    const idx = AppState.wishlist.indexOf(dishId);
    if (idx >= 0) {
      AppState.wishlist.splice(idx, 1);
      this.showToast('Removed from Wishlist 🤍');
    } else {
      AppState.wishlist.push(dishId);
      this.showToast('Saved to Wishlist! ❤️');
    }

    this.saveState();
    this.renderHome();
    this.renderMenuFiltered();

    if ($('accountModal')?.classList.contains('active')) {
      this.switchAccountTab('wishlist');
    }
  },

  removeFromWishlist(dishId) {
    const dish = DISHES.find(d => d.id === dishId);
    AppState.wishlist = AppState.wishlist.filter(id => id !== dishId);
    this.saveState();
    this.renderHome();
    this.renderMenuFiltered();
    this.switchAccountTab('wishlist');
    this.showToast(`Removed "${dish ? dish.name : 'dish'}" from Wishlist 🤍`);
  },

  clearWishlist() {
    if (!AppState.wishlist.length) return;
    AppState.wishlist = [];
    this.saveState();
    this.renderHome();
    this.renderMenuFiltered();
    this.switchAccountTab('wishlist');
    this.showToast('Cleared all items from Wishlist 🤍');
  },

  // User Account Modal
  openAccount(tab = 'profile') {
    this.switchAccountTab(tab);
    $('accountModal')?.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  switchAccountTab(tab) {
    $$('.account-tab-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tab));
    const body = $('accountModalBody');
    if (!body) return;

    if (tab === 'profile') {
      const activeAddress = sanitizeAddress(AppState.selectedAddress) || sanitizeAddress(AppState.user.addresses[0]) || DEFAULT_ADDRESSES[0];
      body.innerHTML = `
        <div style="display:flex;align-items:center;gap:1.25rem;margin-bottom:1.5rem;padding-bottom:1.25rem;border-bottom:1px solid var(--border);">
          <div style="width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--primary),#E8551E);color:#fff;display:flex;align-items:center;justify-content:center;font-size:1.75rem;font-weight:700;">PS</div>
          <div style="flex:1;">
            <h3 style="font-size:1.3rem;">${AppState.user.name}</h3>
            <p style="color:var(--text-muted);font-size:0.9rem;">${AppState.user.email} • ${AppState.user.phone}</p>
            <span class="hero-badge" style="margin-top:0.4rem;display:inline-block;">🪙 ${AppState.user.credits} FreshCredits Member</span>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1.25rem;">
          <div style="background:#FFFBEB;border:1.5px solid #F59E0B;border-radius:var(--radius-sm);padding:0.85rem;cursor:pointer;" onclick="FreshBite.switchAccountTab('credits')">
            <div style="font-size:1.4rem;margin-bottom:0.25rem;">🪙</div>
            <strong style="color:#92400E;font-size:0.95rem;display:block;">${AppState.user.credits} FreshCredits</strong>
            <span style="font-size:0.75rem;color:#B45309;">Worth ₹${AppState.user.credits} OFF • View Wallet →</span>
          </div>

          <div style="background:var(--bg-cream);border:1.5px solid var(--border);border-radius:var(--radius-sm);padding:0.85rem;cursor:pointer;" onclick="FreshBite.switchAccountTab('addresses')">
            <div style="font-size:1.4rem;margin-bottom:0.25rem;">📍</div>
            <strong style="font-size:0.95rem;display:block;">${AppState.user.addresses.length} Saved Addresses</strong>
            <span style="font-size:0.75rem;color:var(--text-muted);">Manage or Add New →</span>
          </div>
        </div>

        <div style="margin-bottom:1.25rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;">
            <h4 style="font-size:0.95rem;">Active Delivery Address</h4>
            <button class="coupon-chip" style="font-size:0.75rem;" onclick="FreshBite.switchAccountTab('addresses')">Change 📍</button>
          </div>
          <div style="font-size:0.85rem;color:var(--text-brown);background:var(--bg-cream);padding:0.75rem;border-radius:var(--radius-sm);border:1px solid var(--border);">
            ${activeAddress}
          </div>
        </div>

        <div style="display:flex;gap:0.75rem;">
          <button class="btn-cta-secondary" style="flex:1;font-size:0.85rem;padding:0.6rem;color:var(--text-brown);" onclick="FreshBite.switchAccountTab('orders')">📦 View Orders (${AppState.orders.length})</button>
          <button class="btn-cta-secondary" style="flex:1;font-size:0.85rem;padding:0.6rem;color:var(--text-brown);" onclick="FreshBite.switchAccountTab('wishlist')">❤️ Saved Dishes (${AppState.wishlist.length})</button>
        </div>
      `;
    } else if (tab === 'credits') {
      const tierName = AppState.user.credits >= 500 ? '💎 Diamond Tier' : AppState.user.credits >= 200 ? '🥇 Gold Tier' : '🥈 Silver Tier';
      const progressPercent = Math.min(100, Math.round((AppState.user.credits / 500) * 100));
      const neededForNext = Math.max(0, 500 - AppState.user.credits);

      body.innerHTML = `
        <div class="credits-hero-card">
          <span class="hero-badge" style="background:#FEF3C7;color:#92400E;border-color:#FDE68A;margin-bottom:0.5rem;display:inline-block;">${tierName} Foodie Member</span>
          <div style="font-size:2.6rem;font-weight:800;color:#92400E;line-height:1.2;margin:0.25rem 0;">🪙 ${AppState.user.credits} <span style="font-size:1.1rem;font-weight:600;color:#B45309;">pts</span></div>
          <p style="font-size:0.95rem;color:#78350F;font-weight:700;margin-bottom:0.85rem;">Worth ₹${AppState.user.credits} Instant Discount on Any Order</p>

          <div style="background:#FDE68A;border-radius:999px;height:10px;overflow:hidden;margin-bottom:0.4rem;max-width:320px;margin-left:auto;margin-right:auto;">
            <div style="background:linear-gradient(90deg, #F59E0B, #B45309);width:${progressPercent}%;height:100%;border-radius:999px;transition:width 0.4s ease;"></div>
          </div>
          <span style="font-size:0.75rem;color:#92400E;font-weight:600;">
            ${neededForNext > 0 ? `${neededForNext} pts until Diamond Tier (500 pts)` : '🎉 Top Diamond Tier Achieved!'}
          </span>
        </div>

        <h4 style="font-size:0.95rem;margin-bottom:0.75rem;">How Play Store-Style FreshCredits Work</h4>
        <div style="display:grid;gap:0.6rem;margin-bottom:1.25rem;">
          <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:var(--radius-sm);padding:0.75rem;display:flex;align-items:center;gap:0.75rem;">
            <div style="font-size:1.5rem;">⚡</div>
            <div>
              <strong style="color:#166534;font-size:0.88rem;display:block;">Earn 10% Cash Back on Every Order</strong>
              <span style="font-size:0.78rem;color:#15803D;">Whenever you purchase dishes, you automatically get 10% back in FreshCredits (min 10 pts guaranteed).</span>
            </div>
          </div>

          <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:var(--radius-sm);padding:0.75rem;display:flex;align-items:center;gap:0.75rem;">
            <div style="font-size:1.5rem;">💸</div>
            <div>
              <strong style="color:#92400E;font-size:0.88rem;display:block;">1 FreshCredit = ₹1 Direct Cash Discount</strong>
              <span style="font-size:0.78rem;color:#B45309;">Redeem seamlessly during checkout. Zero minimum balance required!</span>
            </div>
          </div>

          <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:var(--radius-sm);padding:0.75rem;display:flex;align-items:center;gap:0.75rem;">
            <div style="font-size:1.5rem;">🏷️</div>
            <div>
              <strong style="color:#1E40AF;font-size:0.88rem;display:block;">Stack with Coupon Codes</strong>
              <span style="font-size:0.78rem;color:#1D4ED8;">Apply FRESH50 or BITE20 first, then redeem FreshCredits on top for maximum savings.</span>
            </div>
          </div>
        </div>

        <button class="btn-cta" style="width:100%;" onclick="FreshBite.closeModal('accountModal'); FreshBite.navigate('menu');">Use Credits to Order Food 🍛</button>
      `;
    } else if (tab === 'orders') {
      if (!AppState.orders.length) {
        body.innerHTML = `
          <div style="text-align:center;padding:2.5rem 1rem;">
            <div style="font-size:3rem;margin-bottom:0.5rem;">📦</div>
            <h3>No Orders Placed Yet</h3>
            <p style="color:var(--text-muted);font-size:0.9rem;margin-top:0.4rem;">Order your favorite Indian dishes and earn 10% FreshCredits!</p>
            <button class="btn-cta" style="margin-top:1.25rem;" onclick="FreshBite.closeModal('accountModal'); FreshBite.navigate('menu');">Explore Menu 🍛</button>
          </div>
        `;
      } else {
        body.innerHTML = AppState.orders.map(o => `
          <div style="background:var(--bg-cream);border:1px solid var(--border);border-radius:var(--radius-sm);padding:1rem;margin-bottom:0.75rem;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.4rem;">
              <div>
                <strong>Order #${o.id}</strong>
                <span style="font-size:0.75rem;background:#DCFCE7;color:#166534;padding:2px 6px;border-radius:4px;font-weight:700;margin-left:6px;">${o.status || 'Placed'}</span>
                <div style="font-size:0.8rem;color:var(--text-muted);margin-top:2px;">${o.date} • ${o.slot}</div>
              </div>
              <strong style="font-size:1.1rem;color:var(--primary-hover);">₹${o.total}</strong>
            </div>

            <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin:0.5rem 0;">
              ${o.appliedCoupon ? `<span style="background:#DCFCE7;color:#166534;font-size:0.75rem;padding:2px 8px;border-radius:4px;font-weight:700;">🏷️ ${o.appliedCoupon} (-₹${o.discount})</span>` : ''}
              ${o.redeemedCredits ? `<span style="background:#FEF3C7;color:#92400E;font-size:0.75rem;padding:2px 8px;border-radius:4px;font-weight:700;">🪙 -₹${o.redeemedCredits} Credits Redeemed</span>` : ''}
              ${o.earnedCredits ? `<span style="background:#FFFBEB;color:#B45309;font-size:0.75rem;padding:2px 8px;border-radius:4px;font-weight:700;border:1px solid #FDE68A;">✨ +${o.earnedCredits} FreshCredits Earned</span>` : ''}
            </div>

            <div style="font-size:0.78rem;color:var(--text-brown);margin-bottom:0.6rem;background:#fff;padding:0.4rem 0.6rem;border-radius:4px;border:1px solid var(--border);">
              📍 Delivered to: <strong>${sanitizeAddress(o.deliveryAddress) || DEFAULT_ADDRESSES[0]}</strong>
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span style="font-size:0.8rem;color:var(--text-muted);">${o.items ? o.items.length : 0} items • Courier: ${o.driver || 'Vikram Sharma'}</span>
              <button class="add-btn" style="padding:0.35rem 0.75rem;font-size:0.78rem;" onclick="FreshBite.closeModal('accountModal'); FreshBite.openTrackingModal('${o.id}')">Track Live 🛵</button>
            </div>
          </div>
        `).join('');
      }
    } else if (tab === 'addresses') {
      AppState.user.addresses = normalizeAddresses(AppState.user.addresses);
      const currentSelected = sanitizeAddress(AppState.selectedAddress) || AppState.user.addresses[0] || DEFAULT_ADDRESSES[0];

      body.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;padding-bottom:0.5rem;border-bottom:1px solid var(--border);">
          <strong style="font-size:0.95rem;">Saved Delivery Addresses (${AppState.user.addresses.length})</strong>
          <button class="coupon-chip" style="font-size:0.8rem;padding:0.3rem 0.75rem;" onclick="FreshBite.toggleAccountAddressForm()">➕ Add New Address</button>
        </div>

        <div id="accountAddressFormWrap" style="display:none;margin-bottom:1.25rem;background:var(--bg-cream);padding:1rem;border-radius:var(--radius-md);border:1.5px solid var(--border);">
          <strong style="display:block;font-size:0.9rem;color:var(--text-brown);margin-bottom:0.6rem;">📍 Add New Delivery Address</strong>
          <div style="display:flex;gap:0.4rem;margin-bottom:0.6rem;">
            <button type="button" class="coupon-chip address-tag-btn active" data-tag="🏠 Home" onclick="FreshBite.selectAddressTag(this, '🏠 Home')">🏠 Home</button>
            <button type="button" class="coupon-chip address-tag-btn" data-tag="🏢 Office" onclick="FreshBite.selectAddressTag(this, '🏢 Office')">🏢 Office</button>
            <button type="button" class="coupon-chip address-tag-btn" data-tag="🌟 Other" onclick="FreshBite.selectAddressTag(this, '🌟 Other')">🌟 Other</button>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:0.5rem;">
            <input type="text" id="accAddressFlat" placeholder="Flat / House / Wing No." style="padding:0.5rem 0.65rem;font-size:0.85rem;border:1px solid var(--border);border-radius:var(--radius-sm);background:#fff;">
            <input type="text" id="accAddressArea" placeholder="Apartment / Street / Area" style="padding:0.5rem 0.65rem;font-size:0.85rem;border:1px solid var(--border);border-radius:var(--radius-sm);background:#fff;">
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:0.75rem;">
            <input type="text" id="accAddressCity" placeholder="City (e.g. Bengaluru)" value="Bengaluru" style="padding:0.5rem 0.65rem;font-size:0.85rem;border:1px solid var(--border);border-radius:var(--radius-sm);background:#fff;">
            <input type="text" id="accAddressPincode" placeholder="PIN Code (6 digits)" value="560100" maxlength="6" style="padding:0.5rem 0.65rem;font-size:0.85rem;border:1px solid var(--border);border-radius:var(--radius-sm);background:#fff;">
          </div>
          <div style="display:flex;gap:0.5rem;justify-content:flex-end;">
            <button type="button" class="btn-cta-secondary" style="padding:0.4rem 0.9rem;font-size:0.82rem;color:var(--text-brown);" onclick="FreshBite.toggleAccountAddressForm(false)">Cancel</button>
            <button type="button" class="btn-cta" style="padding:0.4rem 1rem;font-size:0.82rem;" onclick="FreshBite.saveNewAddress(true)">Save Address 📍</button>
          </div>
        </div>

        <div class="address-list-wrap">
          ${AppState.user.addresses.map((addr, idx) => {
            const cleanAddr = sanitizeAddress(addr);
            const isDefault = cleanAddr === currentSelected;
            const parts = cleanAddr.split('—');
            const tag = parts[0]?.trim() || '📍 Address';
            const details = parts[1]?.trim() || cleanAddr;

            return `
              <div class="address-item-card">
                <div style="flex:1;">
                  <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.35rem;">
                    <strong style="font-size:0.95rem;color:var(--text-brown);">${tag}</strong>
                    ${isDefault ? `<span style="background:#DCFCE7;color:#166534;font-size:0.72rem;padding:2px 7px;border-radius:999px;font-weight:700;">✓ Active Delivery</span>` : ''}
                  </div>
                  <p style="font-size:0.85rem;color:var(--text-brown);line-height:1.4;">${details}</p>
                </div>
                <div style="display:flex;flex-direction:column;gap:0.4rem;align-items:flex-end;">
                  ${!isDefault ? `
                    <button class="coupon-chip" style="font-size:0.75rem;padding:0.25rem 0.6rem;" onclick="FreshBite.selectSavedAddress(${idx})">
                      Select 📍
                    </button>
                  ` : ''}
                  <button title="Remove address" style="color:var(--danger);background:#FEF2F2;border:1px solid #FECACA;border-radius:var(--radius-sm);padding:0.25rem 0.6rem;font-size:0.75rem;font-weight:700;cursor:pointer;" onclick="FreshBite.removeAddress(${idx})">
                    🗑️ Delete
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    } else if (tab === 'wishlist') {
      const items = DISHES.filter(d => AppState.wishlist.includes(d.id));
      if (!items.length) {
        body.innerHTML = `
          <div style="text-align:center;padding:2.5rem 1rem;">
            <div style="font-size:3rem;margin-bottom:0.5rem;">🤍</div>
            <h3>Your Wishlist is Empty</h3>
            <p style="color:var(--text-muted);font-size:0.9rem;margin-top:0.4rem;">Tap the ❤️ heart icon on any Indian dish to save it here for later!</p>
            <button class="btn-cta" style="margin-top:1.25rem;" onclick="FreshBite.closeModal('accountModal'); FreshBite.navigate('menu');">Explore Dishes</button>
          </div>
        `;
      } else {
        body.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;padding-bottom:0.5rem;border-bottom:1px solid var(--border);">
            <strong style="font-size:0.95rem;">Saved Dishes (${items.length})</strong>
            <button style="color:var(--danger);font-size:0.8rem;font-weight:700;cursor:pointer;background:none;border:none;" onclick="FreshBite.clearWishlist()">Clear All ✕</button>
          </div>
        ` + items.map(d => `
          <div style="display:flex;align-items:center;gap:1rem;padding:0.75rem 0;border-bottom:1px solid var(--border);">
            <img src="${d.image}" alt="${d.name}" style="width:56px;height:56px;border-radius:var(--radius-sm);object-fit:cover;">
            <div style="flex:1;">
              <strong style="font-size:0.95rem;display:block;">${d.name}</strong>
              <div style="color:var(--primary-hover);font-weight:700;font-size:0.95rem;">₹${d.price}</div>
            </div>
            <div style="display:flex;align-items:center;gap:0.4rem;">
              <button class="add-btn" style="padding:0.45rem 0.85rem;font-size:0.82rem;" onclick="FreshBite.addToCart('${d.id}')">+ Add to Cart</button>
              <button title="Remove from wishlist" style="color:var(--danger);background:#FEF2F2;border:1px solid #FECACA;border-radius:var(--radius-sm);padding:0.45rem 0.65rem;font-size:0.82rem;font-weight:700;cursor:pointer;" onclick="FreshBite.removeFromWishlist('${d.id}')">✕ Remove</button>
            </div>
          </div>
        `).join('');
      }
    }
  },

  // About & Contact Views
  renderAbout() {
    const teamGrid = $('aboutTeamGrid');
    const awardsGrid = $('aboutAwardsGrid');

    if (teamGrid) {
      teamGrid.innerHTML = TEAM_MEMBERS.map(m => `
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);overflow:hidden;box-shadow:var(--shadow-sm);">
          <img src="${m.image}" alt="${m.name}" style="width:100%;height:180px;object-fit:cover;">
          <div style="padding:1rem;">
            <h4 style="font-size:1.05rem;">${m.name}</h4>
            <div style="color:var(--primary);font-weight:700;font-size:0.8rem;margin-bottom:0.4rem;">${m.role}</div>
            <p style="font-size:0.85rem;color:var(--text-muted);">${m.desc}</p>
          </div>
        </div>
      `).join('');
    }

    if (awardsGrid) {
      awardsGrid.innerHTML = AWARDS.map(a => `
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md);padding:1.25rem;display:flex;align-items:center;gap:1rem;">
          <div style="font-size:2rem;">🏆</div>
          <div>
            <span style="font-size:0.8rem;color:var(--primary);font-weight:700;">${a.year}</span>
            <h4 style="font-size:0.95rem;">${a.title}</h4>
            <span style="font-size:0.8rem;color:var(--text-muted);">${a.org}</span>
          </div>
        </div>
      `).join('');
    }
  },

  renderContact() {
    const form = $('contactForm');
    if (form) {
      form.onsubmit = e => {
        e.preventDefault();
        FreshBite.showToast('Dhanyavaad! Your message has been sent to our chef support team. 💌');
        form.reset();
      };
    }
  },

  // Modals & Notifications
  closeModal(modalId) {
    $(modalId)?.classList.remove('active');
    if (!$$('.modal-overlay.active, .cart-drawer.active').length) {
      document.body.style.overflow = '';
    }
  },

  showToast(message) {
    let toast = $('appToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'appToast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
    }, 2800);
  },

  // Event Listeners
  bindEvents() {
    $$('.dietary-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        $$('.dietary-filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        AppState.dietaryFilter = chip.dataset.diet;
        FreshBite.renderMenuFiltered();
      });
    });

    $$('.cat-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        $$('.cat-filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        AppState.categoryFilter = chip.dataset.cat;
        FreshBite.renderMenuFiltered();
      });
    });

    $('menuSearchInput')?.addEventListener('input', e => {
      AppState.searchQuery = e.target.value;
      FreshBite.renderMenuFiltered();
    });

    $('navCartBtn')?.addEventListener('click', e => {
      e.preventDefault();
      FreshBite.openCart();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        FreshBite.closeCart();
        $$('.modal-overlay').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
      }
    });

    $$('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          modal.classList.remove('active');
          if (!$$('.modal-overlay.active, .cart-drawer.active').length) {
            document.body.style.overflow = '';
          }
        }
      });
    });
  }
};

// Bootstrap application on page load
document.addEventListener('DOMContentLoaded', () => {
  FreshBite.init();
});
