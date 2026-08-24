/**
 * Bloom — the organic 4-petal mark of AETHER SPATIAL.
 * Each petal is a leaf-shaped path rotated 90° around the centre,
 * so the four together compose a single quiet blossom.
 */
export function Bloom({
  size = 120,
  color = "#b3a184",
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  const petal = "M 60 60 C 60 36, 74 20, 60 6 C 46 20, 60 36, 60 60 Z";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      aria-hidden
    >
      <g fill={color}>
        <path d={petal} />
        <path d={petal} transform="rotate(90 60 60)" />
        <path d={petal} transform="rotate(180 60 60)" />
        <path d={petal} transform="rotate(270 60 60)" />
      </g>
      <circle cx="60" cy="60" r="4" fill="#f4f3ef" />
    </svg>
  );
}
