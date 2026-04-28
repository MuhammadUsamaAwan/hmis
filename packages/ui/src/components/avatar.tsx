import {
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Avatar as AvatarPrimitive,
} from "@/ui/shadcn/components/ui/avatar";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0] ?? "";
  if (parts.length === 1) {
    return first.slice(0, 2).toUpperCase();
  }
  return ((first[0] ?? "") + (parts.at(-1)?.[0] ?? "")).toUpperCase();
}

export type AvatarSize = "sm" | "default" | "lg";

export interface AvatarProps {
  src?: string;
  name?: string;
  fallback?: string;
  size?: AvatarSize;
  badge?: React.ReactNode;
}

export function Avatar({ src, name, fallback, size = "default", badge }: AvatarProps) {
  const fallbackText = fallback ?? (name ? getInitials(name) : "?");

  return (
    <AvatarPrimitive size={size}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback>{fallbackText}</AvatarFallback>
      {badge !== undefined && <AvatarBadge>{badge}</AvatarBadge>}
    </AvatarPrimitive>
  );
}

export { AvatarGroup, AvatarGroupCount };
