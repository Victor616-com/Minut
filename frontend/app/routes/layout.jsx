import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div className="app-layout">
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
