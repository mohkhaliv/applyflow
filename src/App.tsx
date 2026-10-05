import { Link, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { BoardPage } from './pages/BoardPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />
        <Route path="/board" element={<BoardPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route
          path="*"
          element={
            <div className="empty">
              <h2>This page doesn’t exist</h2>
              <Link to="/">Go to dashboard</Link>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
