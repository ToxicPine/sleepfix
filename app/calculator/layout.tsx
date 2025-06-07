import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vitamin C Sleep Calculator",
  description: "Get Your Sleep Back After ADHD Medication.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😴</text></svg>",
  },
};

export default function CalculatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="max-w-6xl mx-auto w-full h-16 sm:h-20 border-t-2 shrink-0 border-gray-200 sm:border-0 sm:border-t-0 sm:z-10 bg-fixed bg-[#fffaef] flex flex-row p-6 items-center">
        <Link href="/" className="w-6 h-6 p-0 m-0 text-gray-500 cursor-pointer">
          <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
        </Link>
      </div>
      <div className="w-full h-full overflow-y-scroll sm:h-auto sm:overflow-visible">
        {children}
      </div>
    </>
  );
}
