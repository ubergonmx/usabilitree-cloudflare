"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, GitBranch } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="absolute inset-0 z-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Free Tree Testing for UX Optimization
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Create and conduct tree tests at no cost. Gather valuable insights to enhance your
              information architecture without breaking the bank.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Button className="bg-green-600 hover:bg-green-700">
              Create Free Test <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline">Participate</Button>
          </div>
          <div className="relative h-[300px] w-[300px] md:h-[400px] md:w-[400px]">
            <GitBranch className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 transform text-green-500 opacity-20" />
            <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 transform rounded-full bg-green-500" />
            <div className="absolute left-1/4 top-1/4 h-3 w-3 rounded-full bg-green-500" />
            <div className="absolute right-1/4 top-1/4 h-3 w-3 rounded-full bg-green-500" />
            <div className="absolute bottom-1/4 left-1/3 h-3 w-3 rounded-full bg-green-500" />
            <div className="absolute bottom-1/4 right-1/3 h-3 w-3 rounded-full bg-green-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
