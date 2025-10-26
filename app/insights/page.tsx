import AuthGuard from '@/components/AuthGuard';

export default function InsightsPage() {
    return (
        <AuthGuard>
            <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen lg:ml-0">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Insights</h1>
                    <p className="text-gray-600">This page is under construction. Stay tuned for updates!</p>
                </div>
            </div>
        </AuthGuard>
    );
}