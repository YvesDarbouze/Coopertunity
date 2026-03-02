export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-[#F0EEE9] animate-pulse">
            <div className="bg-[#F0EEE9] border-b border-[#3D3935]/10 px-8 py-12">
                <div className="max-w-7xl mx-auto flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gray-200" />
                    <div className="space-y-2">
                        <div className="h-8 w-64 bg-gray-200 rounded-md" />
                        <div className="h-4 w-48 bg-gray-200 rounded-md" />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
                    <div className="h-[200px] bg-white rounded-3xl border border-gray-100 shadow-sm p-6" />
                    <div className="h-[200px] bg-white rounded-3xl border border-gray-100 shadow-sm p-6" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="h-[300px] bg-white rounded-3xl border border-gray-100 shadow-sm p-6" />
                    <div className="h-[300px] bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:col-span-2" />
                </div>
            </div>
        </div>
    );
}
