import type { CSSProperties, ReactNode } from 'react';

export function Skeleton({
  width,
  height,
  className,
  style,
}: {
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: CSSProperties;
}) {
  return <span className={`skeleton ${className ?? ''}`} style={{ width, height, ...style }} aria-hidden="true" />;
}

export function SkeletonBlock({ children }: { children?: ReactNode }) {
  return <span aria-hidden="true">{children}</span>;
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <span className={`skeleton-text ${className ?? ''}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} height={9} width={`${100 - index * 14}%`} />
      ))}
    </span>
  );
}

export function SkeletonRows({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={`skeleton-rows ${className ?? ''}`} aria-hidden="true">
      {Array.from({ length: rows }).map((_, index) => (
        <div className="skeleton-row" key={index}>
          <Skeleton width={22} height={22} />
          <span className="skeleton-row-body">
            <Skeleton height={10} width="70%" />
            <Skeleton height={8} width="40%" />
          </span>
          <Skeleton width={56} height={10} />
        </div>
      ))}
    </div>
  );
}
