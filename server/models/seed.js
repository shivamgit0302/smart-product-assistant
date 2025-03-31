import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Product from "./Product.js";

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the correct location
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Check if the environment variable is loaded
console.log("MongoDB URI:", process.env.MONGODB_URI);

const sampleProducts = [
  // Electronics Category
  {
    name: "MacBook Air",
    description:
      "Ultra-thin, lightweight laptop perfect for students and professionals. Features all-day battery life, stunning Retina display, and powerful performance for all your coding and design needs.",
    price: 999.99,
    category: "Electronics",
    imageUrl: "https://placehold.co/400x300/e6f7ff/0066cc?text=MacBook+Air",
    attributes: {
      color: "Silver",
      weight: "2.8 lbs",
      features: [
        "13.3-inch Retina display",
        "Apple M1 chip",
        "8GB RAM",
        "256GB SSD",
      ],
    },
  },
  {
    name: "Noise-Cancelling Headphones",
    description:
      "Premium wireless headphones with active noise cancellation, 30-hour battery life, and comfortable over-ear design. Ideal for studying in noisy environments or enjoying music without distractions.",
    price: 249.99,
    category: "Electronics",
    imageUrl: "https://placehold.co/400x300/222222/ffffff?text=NC+Headphones",
    attributes: {
      color: "Black",
      features: [
        "Active noise cancellation",
        "Bluetooth 5.0",
        "Touch controls",
        "Voice assistant support",
      ],
    },
  },
  {
    name: "iPad Pro",
    description:
      "Powerful tablet with stunning display, ideal for digital art, note-taking, and productivity. Perfect for students, creatives, and professionals who need a portable device for work and entertainment.",
    price: 799.99,
    category: "Electronics",
    imageUrl: "https://placehold.co/400x300/f2f2f2/666666?text=iPad+Pro",
    attributes: {
      color: "Space Gray",
      storage: "256GB",
      features: [
        "11-inch Liquid Retina display",
        "Apple M2 chip",
        "Apple Pencil support",
        "Face ID",
      ],
    },
  },
  {
    name: "Portable External SSD",
    description:
      "Ultra-fast external SSD with 1TB storage capacity. Compact, durable design makes it perfect for backing up assignments, storing large files, and transferring data quickly.",
    price: 159.99,
    category: "Electronics",
    imageUrl: "https://placehold.co/400x300/333333/00ffcc?text=Portable+SSD",
    attributes: {
      capacity: "1TB",
      features: [
        "USB-C connection",
        "Shock-resistant",
        "Transfer speeds up to 1050MB/s",
      ],
    },
  },
  {
    name: "Wireless Charging Pad",
    description:
      "Fast-charging wireless pad compatible with all Qi-enabled devices. Sleek, minimal design fits perfectly on any desk or nightstand.",
    price: 29.99,
    category: "Electronics",
    imageUrl:
      "https://placehold.co/400x300/222222/00ffff?text=Wireless+Charger",
    attributes: {
      color: "Black",
      features: ["10W fast charging", "LED indicator", "Non-slip surface"],
    },
  },

  // Coffee & Kitchen Category
  {
    name: "Professional Coffee Maker",
    description:
      "Barista-quality coffee maker with programmable settings, built-in grinder, and thermal carafe to keep coffee hot for hours. Perfect gift for coffee enthusiasts who appreciate precision brewing.",
    price: 189.95,
    category: "Kitchen Appliances",
    imageUrl: "https://placehold.co/400x300/663300/ffffff?text=Coffee+Maker",
    attributes: {
      color: "Black/Stainless Steel",
      features: [
        "Programmable",
        "Built-in grinder",
        "10-cup capacity",
        "Auto shut-off",
      ],
    },
  },
  {
    name: "Artisan Coffee Bean Sampler",
    description:
      "Collection of premium single-origin coffee beans from around the world. The perfect gift for coffee lovers who enjoy exploring different flavors and brewing methods.",
    price: 39.95,
    category: "Food & Beverages",
    imageUrl: "https://placehold.co/400x300/996633/ffffff?text=Coffee+Beans",
    attributes: {
      weight: "16 oz",
      features: [
        "4 varieties",
        "Freshly roasted",
        "Fair trade certified",
        "Includes tasting notes",
      ],
    },
  },
  {
    name: "Ceramic Pour-Over Coffee Set",
    description:
      "Elegant ceramic pour-over coffee maker with matching mug. Produces clean, flavorful coffee through manual brewing process coffee enthusiasts love.",
    price: 59.95,
    category: "Kitchen Appliances",
    imageUrl: "https://placehold.co/400x300/ffffff/663300?text=Pour-Over+Set",
    attributes: {
      color: "Matte Black",
      features: [
        "Includes reusable filter",
        "16 oz capacity",
        "Dishwasher safe",
      ],
    },
  },
  {
    name: "Smart Kitchen Scale",
    description:
      "Precise digital kitchen scale with app connectivity for recipe guidance. Perfect for coffee brewing, baking, and cooking with accurate measurements.",
    price: 49.99,
    category: "Kitchen Appliances",
    imageUrl: "https://placehold.co/400x300/e6e6e6/333333?text=Kitchen+Scale",
    attributes: {
      color: "White",
      features: [
        "0.1g precision",
        "App connectivity",
        "Multiple units",
        "Recipe database",
      ],
    },
  },

  // Home Office Category
  {
    name: "Ergonomic Office Chair",
    description:
      "Adjustable office chair with lumbar support, breathable mesh back, and comfortable padding for long study or work sessions. Designed to reduce back pain and improve posture.",
    price: 179.99,
    category: "Furniture",
    imageUrl: "https://placehold.co/400x300/333333/ffffff?text=Ergonomic+Chair",
    attributes: {
      color: "Black",
      features: [
        "Adjustable height",
        "Lumbar support",
        "360° swivel",
        "Breathable mesh",
      ],
    },
  },
  {
    name: "Smart LED Desk Lamp",
    description:
      "Adjustable desk lamp with multiple brightness levels, color temperatures, and USB charging port. Perfect for late-night studying and reducing eye strain.",
    price: 49.99,
    category: "Home Office",
    imageUrl: "https://placehold.co/400x300/ffffff/333333?text=LED+Desk+Lamp",
    attributes: {
      color: "White",
      features: [
        "USB charging port",
        "Touch controls",
        "Adjustable arm",
        "5 color temperatures",
      ],
    },
  },
  {
    name: "Minimalist Desk Organizer",
    description:
      "Sleek wooden desk organizer with compartments for stationery, devices, and accessories. Helps maintain a clean, productive workspace.",
    price: 34.95,
    category: "Home Office",
    imageUrl: "https://placehold.co/400x300/e6ccb3/663300?text=Desk+Organizer",
    attributes: {
      material: "Bamboo",
      features: [
        "Phone stand",
        "Pen holder",
        "Cable management",
        "Sustainable materials",
      ],
    },
  },
  {
    name: "Bluetooth Mechanical Keyboard",
    description:
      "Compact mechanical keyboard with customizable RGB lighting and satisfying tactile keys. Perfect for programming, writing, and gaming with precision input.",
    price: 89.99,
    category: "Computer Accessories",
    imageUrl:
      "https://placehold.co/400x300/333333/00ffff?text=Mechanical+Keyboard",
    attributes: {
      color: "Black",
      features: [
        "Blue switches",
        "RGB backlighting",
        "Multi-device pairing",
        "Programmable keys",
      ],
    },
  },

  // Health & Fitness
  {
    name: "Smart Water Bottle",
    description:
      "Insulated water bottle that tracks hydration and glows to remind you to drink water. Keeps beverages cold for 24 hours or hot for 12 hours.",
    price: 45.99,
    category: "Health & Fitness",
    imageUrl:
      "https://placehold.co/400x300/66ccff/ffffff?text=Smart+Water+Bottle",
    attributes: {
      capacity: "20 oz",
      color: "Teal",
      features: [
        "Hydration tracking",
        "Temperature display",
        "App connectivity",
        "BPA-free",
      ],
    },
  },
  {
    name: "Premium Yoga Mat",
    description:
      "Extra-thick, non-slip yoga mat made from eco-friendly materials. Perfect for home workouts, meditation, and stretching to counterbalance long hours of sitting.",
    price: 78.99,
    category: "Health & Fitness",
    imageUrl: "https://placehold.co/400x300/cc99cc/ffffff?text=Yoga+Mat",
    attributes: {
      color: "Purple",
      thickness: "6mm",
      features: [
        "Non-slip surface",
        "Carrying strap included",
        "Eco-friendly materials",
      ],
    },
  },

  // Bags & Accessories
  {
    name: "Minimalist Backpack",
    description:
      "Stylish, water-resistant backpack with laptop compartment and multiple pockets. Perfect for commuting to campus or office with all your essentials organized.",
    price: 79.99,
    category: "Bags & Accessories",
    imageUrl:
      "https://placehold.co/400x300/003366/ffffff?text=Minimalist+Backpack",
    attributes: {
      color: "Navy Blue",
      features: [
        "15-inch laptop sleeve",
        "Water bottle holder",
        "Hidden anti-theft pocket",
        "Water-resistant material",
      ],
    },
  },

  // Home & Garden
  {
    name: "Indoor Herb Garden Kit",
    description:
      "Self-watering indoor garden with built-in grow lights. Grow fresh herbs year-round right in your kitchen - perfect gift for cooking enthusiasts and health-conscious individuals.",
    price: 99.95,
    category: "Home & Garden",
    imageUrl: "https://placehold.co/400x300/ccffcc/006600?text=Herb+Garden",
    attributes: {
      features: [
        "Self-watering system",
        "LED grow lights",
        "Includes 6 herb pods",
        "Smart reminders",
      ],
    },
  },

  // Education & Creativity
  {
    name: "Digital Drawing Tablet",
    description:
      "Pressure-sensitive drawing tablet for digital art, note-taking, and graphic design. Perfect for art students or creative professionals who need precision control.",
    price: 249.99,
    category: "Electronics",
    imageUrl: "https://placehold.co/400x300/000000/00ff00?text=Drawing+Tablet",
    attributes: {
      size: "Medium",
      features: [
        "8192 pressure levels",
        "Tilt recognition",
        "Wireless connectivity",
        "Customizable buttons",
      ],
    },
  },
  {
    name: "Programming Fundamentals Book Bundle",
    description:
      "Comprehensive set of programming books covering Python, JavaScript, and data structures. Perfect for beginners and intermediate coders looking to build a solid foundation.",
    price: 89.95,
    category: "Books & Education",
    imageUrl: "https://placehold.co/400x300/f2f2f2/0000cc?text=Coding+Books",
    attributes: {
      format: "Hardcover & Digital",
      pages: "1200+",
      features: [
        "Practice exercises",
        "Online code repository",
        "Free updates",
        "Beginner friendly",
      ],
    },
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined");
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert sample products
    const result = await Product.insertMany(sampleProducts);
    console.log(`Added ${result.length} products to database`);

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
