interface PlaceholderImageProps {
  width?: number | string;
  height: number | string;
  radius?: number;
  className?: string;
}

export function PlaceholderImage({
  width = "100%",
  height,
  radius = 24,
  className = "",
}: PlaceholderImageProps) {
  return (
    <div
      className={`bg-placeholder ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: `${radius}px`,
      }}
    />
  );
}
