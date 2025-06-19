import { Link, Outlet } from "react-router-dom";

import styles from "./MainLayout.module.scss";

const MainLayout = () => {
  return (
    <>
      <header>
        <nav>
          <ul className={styles.navigation}>
            <li>
              <Link to="/">Users</Link>
            </li>
            <li>
              <Link to="/companies">Companies</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
