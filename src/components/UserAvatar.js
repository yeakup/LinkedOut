function UserAvatar({ name, size = 'md', className = '' }) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm', 
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-20 h-20 text-2xl'
  };

  const initial = name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center bg-gray-400 text-white font-bold ${className}`}>
      {initial}
    </div>
  );
}

export default UserAvatar;

