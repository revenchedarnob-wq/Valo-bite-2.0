"use client";

import React, { useState } from "react";
import { type CloudAsset } from "@/lib/media";

interface LuxuryImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  asset: CloudAsset | string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  hoverZoom?: boolean;
  ambientShadow?: boolean;
}

export function LuxuryImage({
  asset,
  alt,
  className = "",
  imageClassName = "",
  hoverZoom = true,
  ambientShadow = false,
  ...props
}: LuxuryImageProps) {
  const [loaded, setLoaded] = useState(false);

  const isAssetObj = typeof asset === "object" && asset !== null;
  const src = isAssetObj ? asset.url : asset;
  const imageAlt = alt || (isAssetObj ? asset.alt : "Luxury curated photograph");
  const blurColor = isAssetObj ? asset.blurColor : "#ded7cb";

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: blurColor }}
    >
      {/* Ambient Blur Placeholder */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-out ${
          loaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        style={{ backgroundColor: blurColor }}
      />

      {/* Main Image with Progressive Reveal */}
      <img
        src={src}
        alt={imageAlt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          loaded ? "opacity-100" : "opacity-0"
        } ${hoverZoom ? "group-hover:scale-105" : ""} ${imageClassName}`}
        {...props}
      />

      {/* Optional Ambient Backlight Shadow */}
      {ambientShadow && (
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-2 -z-10 blur-2xl opacity-40 transition-opacity duration-500 group-hover:opacity-70"
          style={{ backgroundColor: blurColor }}
        />
      )}
    </div>
  );
}
