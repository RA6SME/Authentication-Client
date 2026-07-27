import LoginForm from './components/LoginForm';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full bg-white font-sans p-4 sm:p-6 lg:p-8">
      {/* Left Column */}
      <div className="flex flex-1 flex-col justify-between items-center px-4 sm:px-12 lg:px-20 py-8">
        <div className="w-full max-w-sm my-auto">
          <LoginForm />
        </div>

        <footer className="text-center text-[10px] text-gray-400 font-medium tracking-wider uppercase">
          © 2026 ALL RIGHTS RESERVED
        </footer>
      </div>

      {/* Right Column: Hero Artwork */}
      <div className="hidden lg:block lg:w-1/2 relative rounded-3xl overflow-hidden min-h-[90vh]">
        <Image
          src="/hero.png"
          alt="Artwork"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}