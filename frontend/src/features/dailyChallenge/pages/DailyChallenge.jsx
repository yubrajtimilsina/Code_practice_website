import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTodayChallenge } from "../api/dailyChallengeApi";
import {
    Trophy,
    Calendar,
    Users,
    Target,
    Clock,
    CheckCircle,
    TrendingUp,
    Zap,
    Play
} from "lucide-react";

export default function DailyChallenge() {
    const [challenge, setChallenge] = useState(null);
    const [userProgress, setUserProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTodayChallenge();
    }, []);

    const fetchTodayChallenge = async () => {
        try {
            setLoading(true);
            const response = await getTodayChallenge();
            setChallenge(response.data.challenge);
            setUserProgress(response.data.userProgress);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch daily challenge:", err);
            setError(err.response?.data?.error || "Failed to load daily challenge");
        } finally {
            setLoading(false);
        }
    };

    const handleStartChallenge = () => {
        if (challenge?.problem?._id) {
            navigate(`/problems/${challenge.problem._id}`);
        }
    };

    const getTimeRemaining = () => {
        if (!challenge) return "";

        const now = new Date();
        const expires = new Date(challenge.expiresAt);
        const diff = expires - now;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}h ${minutes}m`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100 p-6">
                <div className="max-w-6xl mx-auto space-y-6">

                    {/* Header Skeleton */}
                    <div className="text-center space-y-3">
                        <div className="h-6 w-36 bg-slate-200 rounded-full mx-auto animate-pulse" />
                        <div className="h-10 w-96 bg-slate-300 rounded mx-auto animate-pulse" />
                        <div className="h-4 w-72 bg-slate-200 rounded mx-auto animate-pulse" />
                    </div>

                    {/* Main Card Skeleton */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
                        <div className="space-y-3">
                            <div className="h-5 w-48 bg-slate-200 rounded animate-pulse" />
                            <div className="h-8 w-3/4 bg-slate-300 rounded animate-pulse" />
                        </div>

                        <div className="flex gap-3">
                            <div className="h-6 w-20 bg-slate-200 rounded-full animate-pulse" />
                            <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
                            <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse" />
                        </div>

                        <div className="grid grid-cols-3 gap-6 pt-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="text-center space-y-2">
                                    <div className="h-8 w-20 bg-slate-300 rounded mx-auto animate-pulse" />
                                    <div className="h-4 w-24 bg-slate-200 rounded mx-auto animate-pulse" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description Skeleton */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                        <div className="h-6 w-56 bg-slate-300 rounded animate-pulse" />
                        <div className="h-4 w-full bg-slate-200 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse" />
                        <div className="h-4 w-4/6 bg-slate-200 rounded animate-pulse" />
                    </div>

                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-100 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-red-100 border border-red-300 rounded-lg p-6 text-center">
                        <p className="text-red-700 font-semibold">{error}</p>
                        <button
                            onClick={fetchTodayChallenge}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!challenge) {
        return (
            <div className="min-h-screen bg-slate-100 p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
                        <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-600 text-lg">No daily challenge available today</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                        <Zap className="w-4 h-4" />
                        Daily Challenge
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
                        Today's Coding Challenge
                    </h1>
                    <p className="text-slate-600 text-lg">
                        Solve today's problem and compete on the leaderboard
                    </p>
                </div>

                {/* Challenge Card */}
                <div className="bg-white border-2 border-slate-200 rounded-2xl shadow-xl overflow-hidden mb-8">

                    {/* Challenge Header */}
                    <div className="bg-white border-b border-slate-200 p-6">
                        <div className="flex items-start justify-between mb-6">

                            {/* Left */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-slate-600 mb-3">
                                    <Calendar className="w-5 h-5" />
                                    <span className="text-sm">
                                        {new Date(challenge.date).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>

                                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                                    {challenge.problem?.title || "Loading..."}
                                </h2>

                                <div className="flex flex-wrap items-center gap-3">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium border ${challenge.difficulty === "Easy"
                                                ? "border-green-500 text-green-600"
                                                : challenge.difficulty === "Medium"
                                                    ? "border-yellow-500 text-yellow-600"
                                                    : "border-red-500 text-red-600"
                                            }`}
                                    >
                                        {challenge.difficulty}
                                    </span>

                                    {challenge.problem?.tags?.slice(0, 3).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Right */}
                            <div className="text-right">
                                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                    <Clock className="w-5 h-5" />
                                    <span>{getTimeRemaining()}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Time remaining</p>
                            </div>
                        </div>

                        {/* User Progress */}
                        {userProgress?.hasCompleted ? (
                            <div className="border border-green-200 bg-green-50 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            Challenge Completed
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            Attempts: {userProgress.attempts} • Rank: #{userProgress.rank || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleStartChallenge}
                                    className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium hover:bg-slate-100"
                                >
                                    View Solution
                                </button>
                            </div>
                        ) : (
                            <div className="border border-slate-200 bg-slate-50 rounded-lg p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Target className="w-6 h-6 text-slate-600" />
                                    <div>
                                        <p className="font-semibold text-slate-900">
                                            Challenge In Progress
                                        </p>
                                        <p className="text-sm text-slate-600">
                                            {userProgress?.attempts > 0
                                                ? `${userProgress.attempts} attempts made`
                                                : "Not started yet"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleStartChallenge}
                                    className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800"
                                >
                                    <Play className="w-4 h-4" />
                                    Start
                                </button>
                            </div>
                        )}
                    </div>


                    {/* Challenge Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                <span className="text-3xl font-bold text-slate-900">
                                    {challenge.participantsCount}
                                </span>
                            </div>
                            <p className="text-slate-600 text-sm">Participants</p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                <span className="text-3xl font-bold text-slate-900">
                                    {challenge.completionRate}%
                                </span>
                            </div>
                            <p className="text-slate-600 text-sm">Completion Rate</p>
                        </div>

                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Trophy className="w-5 h-5 text-yellow-600" />
                                <span className="text-3xl font-bold text-slate-900">
                                    {challenge.totalCompletions}
                                </span>
                            </div>
                            <p className="text-slate-600 text-sm">Completed</p>
                        </div>
                    </div>
                </div>

                {/* Problem Description Preview */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm mb-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Problem Description</h3>
                    <p className="text-slate-700 leading-relaxed mb-6">
                        {challenge.problem?.description?.substring(0, 300) || "Loading..."}
                        {challenge.problem?.description?.length > 300 && "..."}
                    </p>
                    <button
                        onClick={handleStartChallenge}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        View Full Problem →
                    </button>
                </div>

                {/* CTA Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button
                        onClick={() => navigate("/daily-challenge/history")}
                        className="p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left"
                    >
                        <Calendar className="w-8 h-8 text-blue-600 mb-3" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Challenge History</h3>
                        <p className="text-slate-600 text-sm">View past daily challenges and your progress</p>
                    </button>

                    <button
                        onClick={() => navigate(`/daily-challenge/leaderboard/${challenge._id}`)}
                        className="p-6 bg-white border-2 border-slate-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all text-left"
                    >
                        <Trophy className="w-8 h-8 text-yellow-600 mb-3" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Today's Leaderboard</h3>
                        <p className="text-slate-600 text-sm">See who solved it fastest today</p>
                    </button>
                </div>

            </div>
        </div>
    );
}