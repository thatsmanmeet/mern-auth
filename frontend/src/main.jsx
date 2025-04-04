import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import { Provider } from 'react-redux';
import store from './store';
import PrivateRoute from './components/PrivateRoute';
import ProfileScreen from './screens/ProfileScreen';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <HomeScreen />,
        index: true,
      },
      {
        path: '/login',
        element: <LoginScreen />,
      },
      { path: '/register', element: <RegisterScreen /> },
      {
        path: '',
        element: <PrivateRoute />,
        children: [
          {
            path: '/profile',
            element: <ProfileScreen />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
