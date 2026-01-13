export type ListingCategory = "Electronics" | "Furniture" | "Vehicles" | "Other";

export type Listing = {
  id: string;
  title: string;
  price: number;
  city: string;
  timeAgo: string; // e.g. "35m ago"
  category: ListingCategory;
  images: string[];
  description: string;
  condition: string;
  brand?: string;
  deliveryAvailable: boolean;
  seller: { name: string; joinedYear?: number; activeSeller?: boolean; avatarUrl?: string };
};

export const MOCK_LISTINGS: Listing[] = [
  {
    id: "1",
    title: "IKEA Kallax Shelf (white)",
    price: 60,
    city: "Surrey",
    timeAgo: "12m ago",
    category: "Furniture",
    images: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=70",
    ],
    description:
      "Sturdy Kallax shelf in good condition. Minor scuffs from normal use. Great for storage or room divider.",
    condition: "Good",
    brand: "IKEA",
    deliveryAvailable: true,
    seller: { name: "Ava", joinedYear: 2022, activeSeller: true },
  },
  {
    id: "2",
    title: "Nintendo Switch + 2 games",
    price: 280,
    city: "Vancouver",
    timeAgo: "35m ago",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=1400&q=70",
    ],
    description:
      "Switch console with Joy-Cons. Includes charger + 2 games. Works great, no drift. Pickup preferred.",
    condition: "Like new",
    brand: "Nintendo",
    deliveryAvailable: false,
    seller: { name: "Jay", joinedYear: 2021, activeSeller: true },
  },
  {
    id: "3",
    title: "Sectional Sofa (delivery avail.)",
    price: 350,
    city: "Burnaby",
    timeAgo: "55m ago",
    category: "Furniture",
    images: [
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1582582429415-99e3d9f4f17f?auto=format&fit=crop&w=1400&q=70",
    ],
    description:
      "Comfortable sectional. Some wear on one corner but still solid. Can help load. Delivery available nearby.",
    condition: "Fair",
    deliveryAvailable: false,
    seller: { name: "Mina", joinedYear: 2020, activeSeller: false },
  },
  {
    id: "4",
    title: "MacBook Pro 14” (M2)",
    price: 1450,
    city: "Richmond",
    timeAgo: "80m ago",
    category: "Electronics",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1400&q=70",
    ],
    description:
      "MacBook Pro 14-inch with M2. Great condition. Includes charger. Can provide serial and proof of purchase.",
    condition: "Good",
    brand: "Apple",
    deliveryAvailable: false,
    seller: { name: "Sam", joinedYear: 2019, activeSeller: true },
  },
  {
    id: "5",
    title: "Vintage floor lamp (brass)",
    price: 45,
    city: "Coquitlam",
    timeAgo: "8m ago",
    category: "Other",
    images: [
      "https://images.unsplash.com/photo-1543198126-a8ad8e47fb22?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1455778971601-5b4c6b5cc6a1?auto=format&fit=crop&w=1400&q=70",
    ],
    description:
      "Brass floor lamp with warm shade. Works perfectly. Great for living room or bedroom corner.",
    condition: "Like new",
    deliveryAvailable: false,
    seller: { name: "Wes", joinedYear: 2023, activeSeller: true },
  },
  {
    id: "6",
    title: "Road bike • tuned • size M",
    price: 520,
    city: "New West",
    timeAgo: "22m ago",
    category: "Vehicles",
    images: [
      "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1525104885119-8806ddfb91c8?auto=format&fit=crop&w=1400&q=70",
    ],
    description:
      "Fast road bike, recently tuned. Smooth shifting. Size M. Helmet not included. Test ride welcome.",
    condition: "Good",
    deliveryAvailable: true,
    seller: { name: "Chris", joinedYear: 2022, activeSeller: false },
  },
  {
    id: "7",
    title: "KitchenAid stand mixer",
    price: 220,
    city: "Vancouver",
    timeAgo: "65m ago",
    category: "Other",
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1400&q=70",
    ],
    description:
      "Classic KitchenAid mixer. Includes bowl and 2 attachments. Great for baking. Works perfectly.",
    condition: "Good",
    brand: "KitchenAid",
    deliveryAvailable: false,
    seller: { name: "Taylor", joinedYear: 2024, activeSeller: true },
  },
  {
    id: "8",
    title: "Navy wool coat (men’s L)",
    price: 70,
    city: "Burnaby",
    timeAgo: "41m ago",
    category: "Other",
    images: [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1400&q=70",
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1400&q=70",
    ],
    description:
      "Warm navy wool coat. Worn a few times. Clean and no damage. Great for fall/winter.",
    condition: "New",
    deliveryAvailable: false,
    seller: { name: "Jordan", joinedYear: 2021, activeSeller: false },
  },
];
