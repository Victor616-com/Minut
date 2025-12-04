import { Outlet } from "react-router";
import { ScrollTrigger, SplitText } from "gsap/all";
import gsap from "gsap";
gsap.registerPlugin(ScrollTrigger, SplitText);
import AccessMenu from "../components/accesability/AccsessMenu";

export default function Layout() {
  return (
    <div className="app-layout">
      <main className="main-content">
        <Outlet />
        <AccessMenu />
      </main>
    </div>
  );
}
