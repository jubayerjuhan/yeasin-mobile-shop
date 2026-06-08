import connectToDatabase from "../lib/mongodb";
import { Category } from "../lib/models/Category";
import { Product } from "../lib/models/Product";

async function addDemo() {
  console.log("Connecting to MongoDB...");
  await connectToDatabase();
  
  console.log("Checking for 'smartphones' category...");
  let cat = await Category.findOne({ slug: "smartphones" });
  if (!cat) {
    console.log("Category not found. Creating 'smartphones' category...");
    cat = await Category.create({
      slug: "smartphones",
      name: "Smartphones",
      description: "Latest smartphones and mobile devices",
      sortOrder: 1
    });
  }

  console.log("Adding iPhone 15 Pro Max...");
  
  // Check if product already exists to avoid duplicates
  const existing = await Product.findOne({ slug: "apple-iphone-15-pro-max" });
  if (existing) {
    console.log("Product already exists!");
    process.exit(0);
  }

  await Product.create({
    slug: "apple-iphone-15-pro-max",
    name: "Apple iPhone 15 Pro Max (256GB)",
    categoryId: cat._id,
    price: 165000, 
    compareAtPrice: 175000,
    shortDescription: "The latest iPhone 15 Pro Max featuring a strong and light aerospace-grade titanium design.",
    description: "Forged in titanium. The iPhone 15 Pro Max features the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever with 5x optical zoom.",
    image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-model-unselect-gallery-2-202309?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1693010534568",
    badge: "New Arrival",
    featured: true,
    inStock: true,
    sku: "IP15PM-NAT-256",
    specs: [
      "6.7-inch Super Retina XDR display", 
      "A17 Pro chip with 6-core GPU", 
      "Aerospace-grade titanium design", 
      "48MP Main camera with 5x Telephoto",
      "USB-C connector with USB 3 speeds"
    ]
  });

  console.log("Demo product successfully added to MongoDB!");
  process.exit(0);
}

addDemo().catch(console.error);
