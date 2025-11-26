
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import AppRoutes from "./app/AppRoutes";
import './index.css';
import { getMe } from './features/auth/slice/authSlice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  return (
    <div>
      <AppRoutes />
    </div>
  );
};

export default App;