export default function MessagesLoading() {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-[#F0EEE9] p-6 animate-pulse">
            <div className="max-w-7xl mx-auto h-full flex flex-col pt-4">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="h-10 w-48 bg-gray-200 rounded-md mb-2" />
                        <div className="h-4 w-64 bg-gray-200 rounded-md" />
                    </div>
                </div>

                <div className="flex-1 bg-white rounded-3xl border border-[#3D3935]/10 shadow-sm overflow-hidden flex flex-col md:flex-row h-[700px]">
                    <div className="w-full md:w-80 border-r border-gray-100 flex flex-col">
                        <div className="p-4 border-b border-gray-100">
                            <div className="h-10 w-full bg-gray-100 rounded-xl" />
                        </div>
                        <div className="overflow-y-auto flex-1 p-2 space-y-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="flex gap-3 p-3 rounded-2xl items-start">
                                    <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                                    <div className="flex-1 py-1">
                                        <div className="h-4 w-32 bg-gray-200 rounded-md mb-2" />
                                        <div className="h-3 w-48 bg-gray-200 rounded-md" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 hidden md:flex flex-col bg-gray-50/50 items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gray-200 mb-4" />
                        <div className="h-6 w-48 bg-gray-200 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
