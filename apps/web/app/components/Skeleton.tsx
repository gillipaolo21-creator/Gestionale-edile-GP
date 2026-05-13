import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: Readonly<SkeletonProps>) {
  return (
    <div className={cn('animate-pulse rounded-md bg-stone-100', className)} />
  );
}

export function CommessaCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="animate-pulse w-10 h-10 rounded-xl bg-stone-100" />
          <div className="space-y-2">
            <div className="animate-pulse h-4 w-48 rounded-md bg-stone-100" />
            <div className="animate-pulse h-3 w-72 rounded-md bg-stone-100" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="space-y-2 text-right">
            <div className="animate-pulse h-3 w-20 ml-auto rounded-md bg-stone-100" />
            <div className="animate-pulse h-6 w-28 ml-auto rounded-md bg-stone-100" />
          </div>
          <div className="animate-pulse w-8 h-8 rounded-lg bg-stone-100" />
          <div className="animate-pulse w-8 h-8 rounded-lg bg-stone-100" />
        </div>
      </div>
    </div>
  );
}

export function SalRowSkeleton() {
  return (
    <div className="flex items-start gap-6">
      <div className="animate-pulse w-10 h-10 rounded-full bg-stone-100 flex-shrink-0" />
      <div className="flex-1 bg-white border border-stone-100 rounded-2xl p-5 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1.5">
            <div className="animate-pulse h-3 w-40 rounded-md bg-stone-100" />
            <div className="animate-pulse h-6 w-32 rounded-md bg-stone-100" />
          </div>
          <div className="animate-pulse h-6 w-20 rounded-full bg-stone-100" />
        </div>
        <div className="animate-pulse h-1.5 w-full rounded-full bg-stone-100" />
        <div className="animate-pulse h-2.5 w-20 rounded-md bg-stone-100" />
      </div>
    </div>
  );
}

export function FatturaRowSkeleton() {
  return (
    <div className="flex items-center justify-between bg-white border border-stone-100 rounded-2xl px-6 py-4">
      <div className="flex items-center gap-4">
        <div className="animate-pulse w-10 h-10 rounded-xl bg-stone-100" />
        <div className="space-y-1.5">
          <div className="animate-pulse h-3.5 w-32 rounded-md bg-stone-100" />
          <div className="animate-pulse h-2.5 w-28 rounded-md bg-stone-100" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="space-y-1.5 text-right">
          <div className="animate-pulse h-3.5 w-28 ml-auto rounded-md bg-stone-100" />
          <div className="animate-pulse h-2.5 w-36 ml-auto rounded-md bg-stone-100" />
        </div>
        <div className="animate-pulse h-7 w-24 rounded-full bg-stone-100" />
      </div>
    </div>
  );
}
