export default function ExploreLoading() {
    return (
        <div className="bg-[#F0EEE9] min-h-screen pb-24 animate-pulse">
            <div className="bg-white border-b border-gray-200 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
                    <div className="mb-8 flex justify-between items-start">
                        <div>
                            <div className="h-10 w-64 bg-gray-200 rounded-md mb-2" />
                            <div className="h-4 w-96 bg-gray-200 rounded-md" />
                        </div>
                    </div>
                    <div className="h-14 w-full bg-gray-50 rounded-2xl" />
                </div>
                <div className="max-w-7xl mx-auto px-6 flex gap-6 relative z-10">
                    <div className="h-8 w-32 bg-gray-200 rounded-md pb-4" />
                    <div className="h-8 w-32 bg-gray-200 rounded-md pb-4" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm h-[200px]" />
                    ))}
                </div>
            </div>
        </div>
    );
}
