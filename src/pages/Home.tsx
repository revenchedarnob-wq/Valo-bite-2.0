import { useState } from "react";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Stats } from "@/components/Stats";
import { Sellers } from "@/components/Sellers";
import { Products } from "@/components/Products";
import { CapsuleEdit } from "@/components/CapsuleEdit";
import { TrustPillars } from "@/components/TrustPillars";
import { CtaBand } from "@/components/CtaBand";
import { scrollToSelector } from "@/lib/scroll";

/**
 * Home — the Valobite landing page.
 * The category picked in the scrolling ticker (and the Curated Capsule
 * Edit) is lifted here so both can drive the Products grid: selecting a
 * category filters the grid and glides the shopper down to it.
 */
export default function Home() {
  const [category, setCategory] = useState("All");

  const handleCategorySelect = (next: string) => {
    setCategory(next);
    scrollToSelector("#products");
  };

  return (
    <>
      <Hero />
      <Marquee onSelect={handleCategorySelect} />
      <Stats />
      <Sellers />
      <Products filter={category} onFilterChange={setCategory} />
      <CapsuleEdit />
      <TrustPillars />
      <CtaBand />
    </>
  );
}
