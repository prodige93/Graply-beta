const loadingImage = '/orange11.png';

interface GrapeLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const sizeMap = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-28 h-28',
};

export default function GrapeLoader({ size = 'lg', fullScreen = false }: GrapeLoaderProps) {
  const img = (
    <img
      src={loadingImage}
      alt="Chargement"
      className={`${sizeMap[size]} animate-wobble object-contain`}
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center lg:pl-80 z-50" style={{ backgroundColor: '#050404' }}>
        {img}
      </div>
    );
  }

  return img;
}
