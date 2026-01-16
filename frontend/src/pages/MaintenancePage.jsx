import { Hammer, Home, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-200 text-center">
                <div className="mb-6 flex justify-center">
                    <div className="p-4 bg-amber-100 rounded-2xl">
                        <Hammer className="w-12 h-12 text-amber-600 animate-bounce" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-2">Under Maintenance</h1>
                <p className="text-slate-600 mb-8">
                    We're currently performing some scheduled maintenance to improve your experience.
                    We'll be back online shortly!
                </p>

                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-500">
                        Estimated back online: <span className="font-semibold text-slate-700">Soon</span>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link
                            to="/"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md"
                        >
                            <Home className="w-5 h-5" />
                            Return Home
                        </Link>

                        <Link
                            to="/login"
                            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            Admin Login
                        </Link>


                    </div>
                </div>
            </div>

            <p className="mt-8 text-slate-400 text-sm">
                &copy; {new Date().getFullYear()} CodePractice. All rights reserved.
            </p>
        </div>
    );
}
