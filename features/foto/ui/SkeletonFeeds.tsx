
export function SkeletonFeeds({ count, viewCount }: { count: number, viewCount: number }) {
    return (
        <div
            className="absolute top-0 left-0 w-full grid gap-4 p-2"
            style={{ gridTemplateColumns: `repeat(${viewCount}, minmax(0, 1fr))` }}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="relative w-full h-full bg-white animate-pulse rounded-xl"
                    style={{ paddingTop: '100%' }} />
            ))}
        </div>
    );
}