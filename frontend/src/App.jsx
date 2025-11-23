import AppRoutes from "./app/AppRoutes";
import './index.css';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold p-6 text-center text-red-800">hiiiii</h1>
      <AppRoutes />
    </div>
  );
};

export default App;