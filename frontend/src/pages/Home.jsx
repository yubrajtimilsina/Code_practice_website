import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-6">

      {/* Header */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-4 text-center">
        Code Practice Website
      </h1>

      <p className="text-lg text-gray-600 text-center max-w-xl">
        Practice coding problems, improve your skills, and track your progress.
      </p>

      {/* CTA Buttons */}
      <div className="flex gap-4 mt-8">
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Register
        </Link>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14 max-w-5xl w-full">

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Practice Questions</h2>
          <p className="text-gray-600">Solve coding problems with multiple difficulty levels.</p>
          <Link to="/problems" className="text-blue-600 mt-3 inline-block font-medium hover:underline">
            View Problems →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Track Progress</h2>
          <p className="text-gray-600">Monitor solved questions, accuracy, and streaks.</p>
          <Link to="/dashboard" className="text-blue-600 mt-3 inline-block font-medium hover:underline">
            Go to Dashboard →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-2">Compete & Improve</h2>
          <p className="text-gray-600">Compare your performance with others and level up.</p>
          <Link to="/leaderboard" className="text-blue-600 mt-3 inline-block font-medium hover:underline">
            Leaderboard →
          </Link>
        </div>

      </div>

      {/* Footer */}
      <p className="text-sm text-gray-500 mt-10">
        © {new Date().getFullYear()} Code Practice Website — Built with MERN
      </p>

    </div>
  );
};

export default Home;
