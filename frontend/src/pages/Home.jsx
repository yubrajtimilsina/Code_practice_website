import { Link } from "react-router-dom";
import { Code2, Trophy, Users, Target, CheckCircle, Zap, BookOpen, TrendingUp } from "lucide-react";

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>

                <div className="max-w-7xl mx-auto px-6 py-20 md:py-32">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-8">
                            <Zap className="w-4 h-4" />
                            Your Coding Journey Starts Here
                        </div>

                        {/* Main Headline */}
                        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
                            Master <span className="text-blue-600">Coding</span>
                            <br />
                            One Problem at a Time
                        </h1>

                        {/* Subheadline */}
                        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                            Join thousands of developers improving their skills through hands-on practice.
                            Solve real problems, track your progress, and ace your next interview.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Link
                                to="/register"
                                className="group px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                            >
                                Get Started Free
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                            <Link
                                to="/login"
                                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg border-2 border-blue-200 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                            >
                                Sign In
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-600" />
                                <span><strong className="text-slate-900">10,000+</strong> Active Learners</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Code2 className="w-5 h-5 text-blue-600" />
                                <span><strong className="text-slate-900">500+</strong> Problems</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-blue-600" />
                                <span><strong className="text-slate-900">50,000+</strong> Solutions Submitted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Why Choose CodePractice?
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Everything you need to become a better programmer
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Feature 1 */}
                    <div className="group bg-white p-8 rounded-2xl shadow-xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Code2 className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">500+ Coding Problems</h3>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            From beginner-friendly to advanced challenges covering arrays, graphs, dynamic programming, and more.
                        </p>
                        <Link to="/problems" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center group">
                            Explore Problems
                            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    {/* Feature 2 */}
                    <div className="group bg-white p-8 rounded-2xl shadow-xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Target className="w-7 h-7 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Personalized Learning Paths</h3>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Structured tracks guide you from beginner to expert, adapting to your skill level and goals.
                        </p>
                        <Link to="/dashboard" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center group">
                            View Dashboard
                            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    {/* Feature 3 */}
                    <div className="group bg-white p-8 rounded-2xl shadow-xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-7 h-7 text-purple-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Real-Time Analytics</h3>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Track your progress with detailed stats on accuracy, speed, and problem-solving patterns.
                        </p>
                        <Link to="/dashboard" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center group">
                            View Analytics
                            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    {/* Feature 4 */}
                    <div className="group bg-white p-8 rounded-2xl shadow-xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Trophy className="w-7 h-7 text-yellow-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Competitive Rankings</h3>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Climb the leaderboard, earn achievements, and compete with programmers worldwide.
                        </p>
                        <Link to="/dashboard" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center group">
                            Check Rankings
                            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    {/* Feature 5 */}
                    <div className="group bg-white p-8 rounded-2xl shadow-xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <CheckCircle className="w-7 h-7 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Instant Feedback</h3>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Get immediate results on your code with detailed test case output and performance metrics.
                        </p>
                        <Link to="/problems" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center group">
                            Try It Now
                            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    {/* Feature 6 */}
                    <div className="group bg-white p-8 rounded-2xl shadow-xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <BookOpen className="w-7 h-7 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">Multi-Language Support</h3>
                        <p className="text-slate-700 leading-relaxed mb-4">
                            Code in JavaScript, Python, Java, C++, and more. Practice in your preferred language.
                        </p>
                        <Link to="/problems" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center group">
                            Start Coding
                            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                            How It Works
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Get started in 3 simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                                1
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Create Account</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Sign up for free in seconds. No credit card required. Start your coding journey immediately.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                                2
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Choose Problems</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Browse our extensive library and pick problems that match your skill level and interests.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                                3
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Code & Learn</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Write code, submit solutions, get instant feedback, and track your progress over time.
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 md:p-16 text-center shadow-2xl">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Level Up Your Skills?
                    </h2>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
                        Join thousands of developers who are already improving their coding skills every day.
                    </p>
                    <Link
                        to="/register"
                        className="inline-block px-10 py-5 bg-white text-blue-600 font-bold text-lg rounded-xl shadow-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
                    >
                        Start Learning for Free →
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="mb-6">
                        <h3 className="text-2xl font-bold text-white mb-2">CodePractice</h3>
                        <p className="text-slate-400">Master coding, one problem at a time.</p>
                    </div>

                    <div className="flex justify-center gap-8 mb-6 text-sm">
                        <Link to="/about" className="hover:text-white transition-colors">About</Link>
                        <Link to="/problems" className="hover:text-white transition-colors">Problems</Link>
                        <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                    </div>

                    <p className="text-sm">
                        © {new Date().getFullYear()} CodePractice. All rights reserved.
                    </p>
                </div>
            </footer>

        </div>
    );
};

export default Home;