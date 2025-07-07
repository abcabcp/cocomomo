
export function SkeletonFeeds({ count }: { count: number }) {
    return (
        <div className="absolute top-0 left-0 w-full grid gap-4 p-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="relative w-full h-full bg-white animate-pulse rounded-xl"
                    style={{ paddingTop: '100%' }} />
            ))}
        </div>
    );
}