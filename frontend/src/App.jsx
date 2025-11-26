
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./features/auth/slice/authSlice";
import AppRoutes from "./app/AppRoutes";
import './index.css';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);
  return (
    <div>

      <AppRoutes />
    </div>
  );
};

export default App;