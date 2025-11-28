import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-6">

      {/* Header */}
      <h1 className="text-5xl font-extrabold text-slate-900 mb-4 text-center leading-tight">
        Elevate Your <span className="text-blue-600">Coding Skills</span>
      </h1>

      <p className="text-lg text-slate-600 text-center max-w-2xl mb-8">
        Master algorithms, solve challenging problems, and prepare for your next coding interview.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Link
          to="/register"
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
        >
          Start Coding Now →
        </Link>
        <Link
          to="/login"
          className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg border border-blue-200 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
        >
          Login
        </Link>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">

        <div className="bg-white p-7 rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Extensive Problem Library</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Access a wide range of coding challenges from easy to expert, covering various data structures and algorithms.</p>
          <Link to="/problems" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center group">
            View Problems
            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="bg-white p-7 rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Personalized Learning Paths</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Follow structured learning paths tailored to your skill level and career goals, guiding you from beginner to advanced.</p>
          <Link to="/dashboard" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center group">
            Go to Dashboard
            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="bg-white p-7 rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Real-time Performance Analytics</h2>
          <p className="text-slate-700 leading-relaxed mb-4">Track your progress with detailed analytics on solved problems, accuracy rate, and time efficiency to pinpoint areas for improvement.</p>
          <Link to="/dashboard" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors inline-flex items-center group">
            View Analytics
            <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

      </div>

      {/* Footer */}
      <p className="text-sm text-slate-500 mt-12">
        © {new Date().getFullYear()} CodePractice. All rights reserved.
      </p>

    </div>
  );
};

export default Home;
