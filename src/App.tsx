import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { Header } from './components/Header';
import { PositionList } from './views/positions';
import { TraderList } from './views/traders';
import { TraderDetail } from './views/traders/TraderDetail';
import { Leaderboard } from './views/leaderboard';
import { Live } from './views/live';

const Container = () => {
  return (
    <div>
      <Header />
      <div className="relative z-2">
        <Outlet />
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Container />,
    children: [
      {
        path: '/',
        element: <Leaderboard />,
      },
      {
        path: '/live',
        element: <Live />,
      },
      {
        path: '/traders',
        element: <TraderList />,
      },
      {
        path: '/traders/:wallet',
        element: <TraderDetail />,
      },
      {
        path: '/positions',
        element: <PositionList />,
      },
      {
        path: '*',
        element: <Navigate to={'/'} replace />,
      },
    ],
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
