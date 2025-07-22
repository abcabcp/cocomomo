export function SkeletonPost() {
    return (
        <div className="h-fit bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 overflow-y-scroll">
            <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden">
                <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-4 md:p-8 lg:p-12">
                    <div className="max-w-5xl mx-auto w-full">
                        <div className="h-10 md:h-12 lg:h-14 bg-gray-700 animate-pulse rounded-lg mb-4 w-3/4" />
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-700 animate-pulse rounded-full" />
                                <div className="h-4 bg-gray-700 animate-pulse rounded w-24" />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-gray-700 animate-pulse rounded-full" />
                                <div className="h-4 bg-gray-700 animate-pulse rounded w-32" />
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="px-3 py-1 bg-gray-700 animate-pulse rounded-full h-6 w-16"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12 h-fit">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-xl">
                    <div className="p-6 md:p-8">
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-4 bg-gray-700 animate-pulse rounded w-full" />
                            ))}
                            <div className="h-4 bg-gray-700 animate-pulse rounded w-2/3" />
                            <div className="h-20 bg-gray-700 animate-pulse rounded w-full" />
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-4 bg-gray-700 animate-pulse rounded w-full" />
                            ))}
                            <div className="h-4 bg-gray-700 animate-pulse rounded w-3/4" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}