import Image from 'next/image';

export function Logo() {
  return (
    <div className="relative h-8 w-8">
      <Image
        src="/assets/image.png"
        alt="File Forge logo"
        fill
        sizes="32px"
        className="object-cover rounded-md"
      />
    </div>
  );
}
