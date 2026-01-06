import Image from 'next/image';

export function Logo() {
  return (
    <div className="relative h-8 w-8">
      <Image
        src="https://uploader.nativespeak.app/files/user_a411945e-ad0c-443c-b568-e8005c55bb31/fileforge/icon-20260106-082419.png"
        alt="File Forge logo"
        fill
        sizes="32px"
        className="object-cover rounded-md"
      />
    </div>
  );
}
