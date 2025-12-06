import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Logo() {
  const logoImage = PlaceHolderImages.find(img => img.id === 'logo');
  
  if (!logoImage) return null;

  return (
    <div className="relative h-8 w-8">
      <Image
        src={logoImage.imageUrl}
        alt={logoImage.description}
        data-ai-hint={logoImage.imageHint}
        fill
        sizes="32px"
        className="object-cover rounded-md"
      />
    </div>
  );
}
