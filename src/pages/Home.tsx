import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Bento } from "@/components/Bento";
import { Gallery } from "@/components/Gallery";
import { Telemetry } from "@/components/Telemetry";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Bento />
      <Gallery />
      <Telemetry />
    </>
  );
}
