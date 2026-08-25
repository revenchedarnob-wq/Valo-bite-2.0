"use client";

import { useEffect, useRef } from "react";
import { playHapticTick } from "@/lib/sound";

const DEFAULT_TAGS = [
  "Silk",
  "Full-Grain Leather",
  "Stoneware",
  "Cashmere",
  "Oak & Walnut",
  "Sterling Silver",
  "Belgian Linen",
];

interface PhysicsTag {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  text: string;
  color: string;
  bg: string;
  isDragging?: boolean;
}

export function GravityCanvas({
  tags = DEFAULT_TAGS,
  className = ""
}: {
  tags?: string[];
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const onResize = () => {
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = canvas.parentElement?.clientHeight || 450;
    };
    window.addEventListener("resize", onResize);

    const colors = [
      { bg: "#ffffff", color: "#1c1b18" },
      { bg: "#1c1b18", color: "#ffffff" },
      { bg: "#eae6dd", color: "#2d2a24" },
      { bg: "#d9cfba", color: "#141310" }
    ];

    // Initialize physical bodies
    const bodies: PhysicsTag[] = tags.map((text, i) => {
      ctx.font = "bold 13px 'Instrument Sans', system-ui, sans-serif";
      const metrics = ctx.measureText(text);
      const w = metrics.width + 36;
      const h = 40;
      const theme = colors[i % colors.length];

      return {
        x: Math.random() * (width - w) + w / 2,
        y: Math.random() * (height / 2) - 100,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 2 + 1,
        width: w,
        height: h,
        text,
        bg: theme.bg,
        color: theme.color
      };
    });

    let draggedBody: PhysicsTag | null = null;
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const getMousePos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      const pos = getMousePos(e);
      mouseX = lastMouseX = pos.x;
      mouseY = lastMouseY = pos.y;

      for (let i = bodies.length - 1; i >= 0; i--) {
        const b = bodies[i];
        if (
          pos.x >= b.x - b.width / 2 &&
          pos.x <= b.x + b.width / 2 &&
          pos.y >= b.y - b.height / 2 &&
          pos.y <= b.y + b.height / 2
        ) {
          draggedBody = b;
          b.isDragging = true;
          playHapticTick();
          break;
        }
      }
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const pos = getMousePos(e);
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      mouseX = pos.x;
      mouseY = pos.y;

      if (draggedBody) {
        draggedBody.x = mouseX;
        draggedBody.y = mouseY;
        draggedBody.vx = (mouseX - lastMouseX) * 0.6;
        draggedBody.vy = (mouseY - lastMouseY) * 0.6;
      }
    };

    const handleMouseUp = () => {
      if (draggedBody) {
        draggedBody.isDragging = false;
        draggedBody = null;
      }
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("touchstart", handleMouseDown);
    window.addEventListener("touchmove", handleMouseMove);
    window.addEventListener("touchend", handleMouseUp);

    // Physics Engine Loop
    const gravity = 0.35;
    const friction = 0.985;
    const bounce = 0.65;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update positions
      bodies.forEach((b, i) => {
        if (!b.isDragging) {
          b.vy += gravity;
          b.vx *= friction;
          b.vy *= friction;
          b.x += b.vx;
          b.y += b.vy;

          // Floor collision
          if (b.y + b.height / 2 > height) {
            b.y = height - b.height / 2;
            b.vy = -b.vy * bounce;
          }
          // Ceiling collision
          if (b.y - b.height / 2 < 0) {
            b.y = b.height / 2;
            b.vy = -b.vy * bounce;
          }
          // Wall collisions
          if (b.x - b.width / 2 < 0) {
            b.x = b.width / 2;
            b.vx = -b.vx * bounce;
          }
          if (b.x + b.width / 2 > width) {
            b.x = width - b.width / 2;
            b.vx = -b.vx * bounce;
          }

          // Simple body-to-body push
          for (let j = i + 1; j < bodies.length; j++) {
            const o = bodies[j];
            const dx = o.x - b.x;
            const dy = o.y - b.y;
            const minDistX = (b.width + o.width) / 2.2;
            const minDistY = (b.height + o.height) / 1.8;

            if (Math.abs(dx) < minDistX && Math.abs(dy) < minDistY) {
              const overlapX = minDistX - Math.abs(dx);
              const overlapY = minDistY - Math.abs(dy);
              if (overlapX < overlapY) {
                const shift = (overlapX / 2) * (dx > 0 ? 1 : -1);
                b.x -= shift;
                o.x += shift;
                b.vx *= -0.5;
                o.vx *= -0.5;
              } else {
                const shift = (overlapY / 2) * (dy > 0 ? 1 : -1);
                b.y -= shift;
                o.y += shift;
                b.vy *= -0.5;
                o.vy *= -0.5;
              }
            }
          }
        }

        // Draw Pill Tag
        ctx.save();
        ctx.translate(b.x, b.y);

        // Shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.08)";
        ctx.shadowBlur = b.isDragging ? 24 : 10;
        ctx.shadowOffsetY = b.isDragging ? 12 : 4;

        // Rounded Pill Background
        ctx.fillStyle = b.bg;
        ctx.beginPath();
        const r = b.height / 2;
        ctx.roundRect(-b.width / 2, -b.height / 2, b.width, b.height, r);
        ctx.fill();

        // Border
        ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Text
        ctx.shadowColor = "transparent";
        ctx.fillStyle = b.color;
        ctx.font = "bold 12px 'Instrument Sans', system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.text, 0, 1);

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("touchstart", handleMouseDown);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [DEFAULT_TAGS]);

  return (
    <div className={`relative w-full h-[450px] overflow-hidden rounded-[2.5rem] bg-[#eae7e0] border border-black/[0.06] ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
