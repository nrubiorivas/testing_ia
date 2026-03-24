import { Link, NavLink, Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <div className="app-shell">
      <header className="header">
        <Link to="/" className="brand">
          Workout Journal
        </Link>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/workouts/new">New
        </NavLink>
        <NavLink to="/workouts">History</NavLink>
        <NavLink to="/exercise-history">Exercises</NavLink>
      </nav>
    </div>
  );
};
