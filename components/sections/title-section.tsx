interface HeroHeaderProps {
  title: string;
  subtitle?: string;
}

export function HeroHeader({ title, subtitle }: HeroHeaderProps) {
  return (
    <div className="space-y-4 mb-4 md:mb-8 max-w-3xl mx-auto text-center">
      <h1 className="leading-tight text-4xl sm:text-5xl font-bold bg-linear-to-r/oklch from-violet-600 via-sky-600 to-violet-600 bg-clip-text text-transparent">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xl sm:text-2xl text-gray-600 max-w-xs sm:max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
