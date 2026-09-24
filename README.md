# 🍛 FreshBite India — Food Ordering & Fast Delivery Web App

**Frontend Web Development Internship Submission**  
A responsive, single-page food ordering web application built using **pure HTML5, CSS3, and Vanilla JavaScript**.

Designed specifically for the Indian market — featuring regional cuisines, **₹ INR** pricing, Indian delivery partner simulation (**Vikram Sharma**), instant UPI / RuPay checkout, and a Google Play Store-inspired rewards loyalty system.

---

## 💡 Project Highlights & Features

### 1. 🍽️ Complete 10-View User Journey (No Frameworks Needed)
* **Home Page**: Hero banner with quick navigation, active discount promo cards, and chef's featured dishes.
* **Restaurants**: Directory of 6 regional partner kitchens (Pind Punjab, Hyderabadi Bawarchi, Sagar Ratna, Royal Awadh, Delhi 6, Mithai Mahal).
* **Food Menu**: Complete dish catalog with live text search and instant dietary filters (Pure Veg, Non-Veg, Vegan, Gluten-Free).
* **Dish Details Modal**: Pop-up with ingredients, nutrition breakdown (calories, protein, carbs, fat), customer reviews, and quick-add button.
* **Cart Drawer (`Aapki Thaali`)**: Slide-out cart with quantity steppers (+/-), coupon application box, 5% GST, and delivery tip calculation.
* **Checkout Screen**: Address selector, flexible delivery time scheduler, and simulated Indian payment methods.
* **Order Tracking**: Interactive 5-stage delivery progress tracker (*Placed → Accepted → Cooking → Out for Delivery → Delivered*) with courier contact simulation.
* **User Profile & Wallet**: Customer details, saved addresses, order history, and FreshCredits balance dashboard.
* **About Us**: Story of FreshBite India, executive chefs, and culinary awards.
* **Contact Us**: Bengaluru headquarters address, operational hours, hotline, and inquiry form.

### 2. 📍 Delivery Address Management
* Customers can save multiple addresses with custom tags (`🏠 Home`, `🏢 Office`, `🌟 Other`).
* Add new addresses on the fly inside the **Checkout Modal** or manage them from the **User Account Modal**.
* Set any saved address as default for checkout, or delete old ones with one click.
* All addresses are saved locally in the browser (`localStorage`), so they persist across page reloads.

### 3. 🪙 Play Store-Style "FreshCredits" Loyalty Program
* **Earn 10% on Every Purchase**: Customers automatically get 10% of their order total back as FreshCredits (minimum 10 points guaranteed).
* **Direct ₹1 Discount**: Each FreshCredit equals exactly **₹1 discount**.
* **1-Tap Redemption**: Redeem credits in the cart or during checkout to lower the final bill.
* **Stack with Coupons**: Can be combined with promo codes (like `FRESH50` or `BITE20`) for extra savings.
* **Tier Progression**: Visual progress bar tracking status toward Silver, Gold (200+ pts), and Diamond (500+ pts) tiers.

### 4. ⏰ Smart Delivery Time Scheduler (30-Minute Safe Buffer)
* Multiple pre-set delivery slots (Express 25-35 min, Lunch, Evening Snacks, Dinner).
* **Custom Time Picker**: Customers can choose an exact delivery time, but the app enforces a **minimum 30-minute buffer** from the current order time to account for fresh cooking and transit. Past or earlier times are automatically rejected with a helpful warning.
* Quick shortcut buttons to easily pick `+30 min (Earliest)`, `+45 min`, `+1 Hour`, or `+2 Hours`.

### 5. 💳 Indian Payment Options
* **UPI / QR Auto-Pay**: Simulated Google Pay, PhonePe, and Paytm checkout with VPA input.
* **RuPay / Debit Card**: Interactive 3D card preview that formats card numbers and updates the cardholder name in real time.
* **Cash on Delivery (COD)**: Option to pay on arrival with courier partner Vikram Sharma.

### 6. ❤️ Wishlist & Favorites
* Heart icon toggle on all dish cards and detail popups.
* Dedicated Wishlist tab in the User Account modal with quick "Add to Cart", individual remove, and "Clear All" options.

---

## 📁 File Structure

The project has zero build steps and is organized into 4 clean files:

```
freshbite/
├── index.html    # Clean semantic HTML markup (views, modals, navigation)
├── style.css     # Vanilla CSS (custom properties, responsive layout, animations)
├── script.js     # ES6 JavaScript (data models, state store, UI rendering, logic)
└── README.md     # Project documentation
```

---

## 🛠️ Tech Stack & Implementation Details

* **HTML5**: Semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`), accessibility labels, clean modal overlays.
* **CSS3**: Custom design tokens (Saffron `#FF6B35`, Warm Cream `#FFF8F0`, Dark Brown `#2D1B12`), Flexbox, CSS Grid, smooth transitions, and mobile bottom navigation dock.
* **JavaScript (ES6+)**:
  * In-memory central `AppState` object.
  * Local storage synchronization for cart items, wishlist, saved addresses, order history, and loyalty credits.
  * No external libraries (zero React, Vue, jQuery, or Tailwind) — 100% native browser APIs.

---

## 🚀 How to Run

1. Clone or download this project folder.
2. Locate `index.html` inside the `freshbite/` directory.
3. Double-click **`index.html`** to launch it in Google Chrome, Microsoft Edge, Firefox, Brave, or Safari.
4. No Node.js, `npm install`, or local server setup required!
