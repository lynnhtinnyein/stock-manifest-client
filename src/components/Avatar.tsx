interface AvatarProps {
  name: string;
  color: string;
}

export default function Avatar({ name, color }: AvatarProps) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <div
      className="avatar-swatch w-9 h-9 rounded-xs flex items-center justify-center text-white text-sm shrink-0"
      style={{ background: color }}
    >
      {initial}
    </div>
  );
}
