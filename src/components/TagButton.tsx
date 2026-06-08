interface TagButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function TagButton({ children, className = "" }: TagButtonProps) {
  return (
    <span
      className={`inline-flex items-center justify-center h-8 min-w-[98px] px-3 rounded-lg bg-surface text-text-primary text-xs ${className}`}
    >
      {children}
    </span>
  );
}
