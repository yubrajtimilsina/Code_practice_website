
import { useEffect, } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from "./app/AppRoutes";
import './index.css';
import { getMe } from './features/auth/slice/authSlice';
import Navbar from './components/Navbar'

const App = () => {
  const dispatch = useDispatch();
   const { user } = useSelector(state => state.auth);


  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

 
  return (
    <div>

      {user && <Navbar />}
      <AppRoutes />
    </div>
  );
};

export default App;