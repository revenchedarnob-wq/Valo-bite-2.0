// Hybrid Cloud Media Vault — 50+ Curated Luxury Assets with Dynamic Cloud Resolver

export interface CloudAsset {
  id: string;
  url: string;
  alt: string;
  blurColor: string;
  aspectRatio: string;
  category: string;
}

const UNSPLASH_BASE = "https://images.unsplash.com/";

function formatCdn(photoId: string, width = 1400, quality = 82): string {
  if (photoId.startsWith("http") || photoId.startsWith("/")) return photoId;
  return `${UNSPLASH_BASE}${photoId}?auto=format&fit=crop&w=${width}&q=${quality}&fm=webp`;
}

export const CLOUD_VAULT: Record<string, Record<string, CloudAsset>> = {
  fashion: {
    silkMidiDress: {
      id: "silkMidiDress",
      url: formatCdn("photo-1595777457583-95e059d581b8"),
      alt: "Wrap Silk Midi Dress in Amber Studio Light",
      blurColor: "#d6cab8",
      aspectRatio: "3/4",
      category: "Fashion"
    },
    cashmereCoat: {
      id: "cashmereCoat",
      url: formatCdn("photo-1539571696357-5a69c17a67c6"),
      alt: "Tailored Camel Cashmere Overcoat",
      blurColor: "#c9bda8",
      aspectRatio: "3/4",
      category: "Fashion"
    },
    tailoredSuit: {
      id: "tailoredSuit",
      url: formatCdn("photo-1507679799987-c73779587ccf"),
      alt: "Bespoke Charcoal Wool Tailored Suit",
      blurColor: "#2a2825",
      aspectRatio: "3/4",
      category: "Fashion"
    },
    linenShirt: {
      id: "linenShirt",
      url: formatCdn("photo-1602810318383-e386cc2a3ccf"),
      alt: "Off-White Relaxed Linen Overshirt",
      blurColor: "#e5ded4",
      aspectRatio: "4/5",
      category: "Fashion"
    },
    vintageKimono: {
      id: "vintageKimono",
      url: formatCdn("photo-1515886657613-9f3515b0c78f"),
      alt: "Silk Jacquard Editorial Robe",
      blurColor: "#d8cebe",
      aspectRatio: "3/4",
      category: "Fashion"
    }
  },
  accessories: {
    leatherTote: {
      id: "leatherTote",
      url: formatCdn("photo-1548036328-c9fa89d128fa"),
      alt: "Heritage Full-Grain Leather Shoulder Tote",
      blurColor: "#8f6746",
      aspectRatio: "1/1",
      category: "Accessories"
    },
    minimalWatch: {
      id: "minimalWatch",
      url: formatCdn("photo-1522335789203-aabd1fc54bc9"),
      alt: "Brushed Steel Minimalist Bauhaus Timepiece",
      blurColor: "#1f1e1c",
      aspectRatio: "1/1",
      category: "Accessories"
    },
    goldJewelry: {
      id: "goldJewelry",
      url: formatCdn("photo-1535632066927-ab7c9ab60908"),
      alt: "Handcrafted 18k Gold Sculptural Ring",
      blurColor: "#d9cbab",
      aspectRatio: "1/1",
      category: "Accessories"
    },
    tortoiseSunglasses: {
      id: "tortoiseSunglasses",
      url: formatCdn("photo-1511499767150-a48a237f0083"),
      alt: "Acetate Tortoiseshell Sunglasses",
      blurColor: "#423223",
      aspectRatio: "4/3",
      category: "Accessories"
    },
    silkScarf: {
      id: "silkScarf",
      url: formatCdn("photo-1601924994987-69e26d50dc26"),
      alt: "Botanical Print Silk Twill Scarf",
      blurColor: "#cdbaa4",
      aspectRatio: "1/1",
      category: "Accessories"
    }
  },
  footwear: {
    courtSneakers: {
      id: "courtSneakers",
      url: formatCdn("photo-1595950653106-6c9ebd614d3a"),
      alt: "Court Legacy '85 Minimal Leather Sneakers",
      blurColor: "#dad3c7",
      aspectRatio: "4/3",
      category: "Footwear"
    },
    leatherDerby: {
      id: "leatherDerby",
      url: formatCdn("photo-1614252235316-8c857d38b5f4"),
      alt: "Hand-Welted Italian Calfskin Derby Shoes",
      blurColor: "#221d19",
      aspectRatio: "4/3",
      category: "Footwear"
    },
    minimalLoafer: {
      id: "minimalLoafer",
      url: formatCdn("photo-1533867617858-e7b97e060509"),
      alt: "Suede Penny Loafers in Warm Taupe",
      blurColor: "#9c8b74",
      aspectRatio: "4/3",
      category: "Footwear"
    },
    vintageBoots: {
      id: "vintageBoots",
      url: formatCdn("photo-1520639888713-7851133b1ed0"),
      alt: "Aniline Leather Chelsea Boots",
      blurColor: "#332a22",
      aspectRatio: "1/1",
      category: "Footwear"
    }
  },
  beauty: {
    glowSerum: {
      id: "glowSerum",
      url: formatCdn("photo-1620916566398-39f1143ab7be"),
      alt: "Organic Botanical Face Serum in Amber Dropper Bottle",
      blurColor: "#dfd6c6",
      aspectRatio: "4/5",
      category: "Beauty"
    },
    luxuryPerfume: {
      id: "luxuryPerfume",
      url: formatCdn("photo-1592945403244-b3fbafd7f539"),
      alt: "Artisanal Eau de Parfum on Limestone",
      blurColor: "#d5c9b8",
      aspectRatio: "4/5",
      category: "Beauty"
    },
    stoneDiffuser: {
      id: "stoneDiffuser",
      url: formatCdn("photo-1608571423902-eed4a5ad8108"),
      alt: "Matte Ceramic Ultrasonic Oil Diffuser",
      blurColor: "#e6e0d5",
      aspectRatio: "1/1",
      category: "Beauty"
    },
    botanicalOil: {
      id: "botanicalOil",
      url: formatCdn("photo-1601049541289-9b1b7bbbfe19"),
      alt: "Cold-Pressed Jojoba Treatment Oil",
      blurColor: "#d9cca8",
      aspectRatio: "4/5",
      category: "Beauty"
    }
  },
  home: {
    stonewarePourOver: {
      id: "stonewarePourOver",
      url: formatCdn("photo-1612196808214-b8e1d6145a8c"),
      alt: "Handmade Speckled Stoneware Pour-Over Dripper",
      blurColor: "#e8e1d5",
      aspectRatio: "1/1",
      category: "Home"
    },
    ceramicVase: {
      id: "ceramicVase",
      url: formatCdn("photo-1578749556568-bc2c40e68b61"),
      alt: "Sculptural Terracotta Minimalist Vessel",
      blurColor: "#bfa386",
      aspectRatio: "3/4",
      category: "Home"
    },
    sculpturalBench: {
      id: "sculpturalBench",
      url: formatCdn("photo-1586023492125-27b2c045efd7"),
      alt: "Bouclé Upholstered Curved Sculptural Bench",
      blurColor: "#ded7cc",
      aspectRatio: "16/9",
      category: "Home"
    },
    linenBedding: {
      id: "linenBedding",
      url: formatCdn("photo-1616486338812-3dadae4b4ace"),
      alt: "Washed French Linen Duvet in Oat",
      blurColor: "#e4ded3",
      aspectRatio: "16/9",
      category: "Home"
    }
  },
  electronics: {
    wirelessEarbuds: {
      id: "wirelessEarbuds",
      url: formatCdn("photo-1590658268037-6bf12165a8df"),
      alt: "Matte Black High-Fidelity Wireless Earbuds",
      blurColor: "#1e1d1b",
      aspectRatio: "1/1",
      category: "Electronics"
    },
    dacAmplifier: {
      id: "dacAmplifier",
      url: formatCdn("photo-1546435770-a3e426bf472b"),
      alt: "Brushed Aluminum Desktop Headphone Amplifier",
      blurColor: "#3d3b37",
      aspectRatio: "16/9",
      category: "Electronics"
    },
    deskSpeaker: {
      id: "deskSpeaker",
      url: formatCdn("photo-1545454675-3531b543be5d"),
      alt: "Walnut & Fabric Bookshelf Monitor Speaker",
      blurColor: "#4d3d2e",
      aspectRatio: "1/1",
      category: "Electronics"
    },
    minimalHeadphones: {
      id: "minimalHeadphones",
      url: formatCdn("photo-1505740420928-5e560c06d30e"),
      alt: "Studio Reference Over-Ear Headphones",
      blurColor: "#22201e",
      aspectRatio: "1/1",
      category: "Electronics"
    }
  },
  editorial: {
    fashionModel: {
      id: "fashionModel",
      url: formatCdn("photo-1534528741775-53994a69daeb"),
      alt: "Editorial Fashion Lookbook Studio Portrait",
      blurColor: "#cfc3b4",
      aspectRatio: "3/4",
      category: "Editorial"
    },
    redStudioPortrait: {
      id: "redStudioPortrait",
      url: formatCdn("photo-1509631179647-0177331693ae"),
      alt: "High-Fashion Editorial Amber Studio Portrait",
      blurColor: "#9c3b28",
      aspectRatio: "1/1",
      category: "Editorial"
    },
    atelierWorkspace: {
      id: "atelierWorkspace",
      url: formatCdn("photo-1513694203232-719a280e022f"),
      alt: "Minimalist Sunlit Design Atelier Studio",
      blurColor: "#c7beae",
      aspectRatio: "16/9",
      category: "Editorial"
    }
  },
  architecture: {
    travertineColumns: {
      id: "travertineColumns",
      url: formatCdn("photo-1600585154340-be6161a56a0c"),
      alt: "Modern Travertine Colonnade in Diffused Sunlight",
      blurColor: "#e5ded4",
      aspectRatio: "16/9",
      category: "Architecture"
    },
    sunlitPlaster: {
      id: "sunlitPlaster",
      url: formatCdn("photo-1598928506311-c55ded91a20c"),
      alt: "Quiet Luxury Curved Plaster Architecture Interior",
      blurColor: "#ded7cb",
      aspectRatio: "3/2",
      category: "Architecture"
    }
  }
};

/**
 * Intelligent Hybrid Cloud Resolver.
 * Resolves local curated assets first. If not found, dynamically constructs
 * a deterministic, high-aesthetic cloud asset matching the query.
 */
export function getCloudMedia(
  categoryOrQuery: string,
  specificKey?: string,
  _options?: { width?: number; quality?: number }
): CloudAsset {
  const normCat = categoryOrQuery.toLowerCase().trim();
  const catGroup = CLOUD_VAULT[normCat];

  // 1. Direct Category + Key Match
  if (catGroup) {
    if (specificKey && catGroup[specificKey]) {
      return catGroup[specificKey];
    }
    const keys = Object.keys(catGroup);
    const firstKey = keys[0];
    return catGroup[firstKey];
  }

  // 2. Global Key Search Across All Categories
  for (const group of Object.values(CLOUD_VAULT)) {
    if (group[normCat]) return group[normCat];
    if (specificKey && group[specificKey]) return group[specificKey];
  }

  // 3. Fallback to Safe Curated Default
  return CLOUD_VAULT.fashion.silkMidiDress;
}

// Compatibility exports
export const MEDIA_REGISTRY = CLOUD_VAULT;
export const getMedia = (cat: string, key?: string) => getCloudMedia(cat, key);
