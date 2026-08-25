import { getCloudMedia, type CloudAsset } from "./media";

export type Seller = {
  id: string;
  name: string;
  tag: string;
  description: string;
  rating: number;
  products?: number;
  image?: CloudAsset;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  seller: string;
  badge?: string;
  image?: CloudAsset;
};

export const SELLERS: Seller[] = [
  {
    id: "s1",
    name: "Maison Aurelle",
    tag: "Vintage",
    description:
      "Hand-picked French vintage — silk scarves, heirloom jewelry, and one-of-a-kind leather goods.",
    rating: 4.9,
    products: 128,
    image: getCloudMedia("editorial", "fashionModel")
  },
  {
    id: "s2",
    name: "Nova & Thread",
    tag: "Fashion",
    description:
      "Small-batch womenswear cut and sewn in-house. Slow fashion with a modern editorial edge.",
    rating: 4.8,
    products: 64,
    image: getCloudMedia("editorial", "atelierWorkspace")
  },
  {
    id: "s3",
    name: "Kiln & Co.",
    tag: "Home",
    description:
      "Stoneware, ceramics, and table objects thrown by a two-person studio in Portland.",
    rating: 5.0,
    products: 42,
    image: getCloudMedia("home", "ceramicVase")
  },
  {
    id: "s4",
    name: "Sole Archive",
    tag: "Footwear",
    description:
      "Deadstock and grail sneakers, authenticated in-house before they ever reach your door.",
    rating: 4.7,
    products: 210,
    image: getCloudMedia("footwear", "courtSneakers")
  },
  {
    id: "s5",
    name: "Lumen Audio",
    tag: "Electronics",
    description:
      "Refined audio gear for people who listen closely — earbuds, DACs, and desk speakers.",
    rating: 4.9,
    products: 18,
    image: getCloudMedia("electronics", "minimalHeadphones")
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Wrap Silk Midi Dress",
    category: "Fashion",
    price: 189,
    seller: "Nova & Thread",
    badge: "✦ Atelier Exclusive",
    image: getCloudMedia("fashion", "silkMidiDress")
  },
  {
    id: "p2",
    name: "Heritage Leather Tote",
    category: "Accessories",
    price: 240,
    seller: "Maison Aurelle",
    badge: "Only 2 Left",
    image: getCloudMedia("accessories", "leatherTote")
  },
  {
    id: "p3",
    name: "Court Legacy '85 Sneakers",
    category: "Footwear",
    price: 135,
    seller: "Sole Archive",
    badge: "Deadstock Grail",
    image: getCloudMedia("footwear", "courtSneakers")
  },
  {
    id: "p4",
    name: "Botanical Glow Serum",
    category: "Beauty",
    price: 48,
    seller: "Maison Aurelle",
    badge: "Organic Extract",
    image: getCloudMedia("beauty", "glowSerum")
  },
  {
    id: "p5",
    name: "Stoneware Pour-Over Set",
    category: "Home",
    price: 76,
    seller: "Kiln & Co.",
    badge: "Hand-Thrown",
    image: getCloudMedia("home", "stonewarePourOver")
  },
  {
    id: "p6",
    name: "Aurora Wireless Earbuds",
    category: "Electronics",
    price: 129,
    seller: "Lumen Audio",
    badge: "Lossless Audio",
    image: getCloudMedia("electronics", "wirelessEarbuds")
  },
];
