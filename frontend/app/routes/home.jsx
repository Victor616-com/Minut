import { useNavigate } from "react-router";
import { UserAuth } from "../context/AuthContext";
import AccessMenu from "../components/accesability/AccsessMenu";
import Separator from "../components/UI_elements/Separator";
import SmallFlower from "../components/UI_elements/flower/SmallFlower";
import ProjectCard from "../components/UI_elements/project/ProjectCard";

export default function Home() {
  const { signOut } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/auth");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <main className="flex flex-col gap px-5">
      <SmallFlower />
      <p className="text-heading1 mt-20 mb-20">
        Your mind deserves a moment. You tracked{" "}
        <span className="gradientText2">46h 32m</span> this week.
      </p>
      <div className="flex flex-col gap-6">
        <Separator>Choose a project</Separator>
        <ProjectCard />
      </div>

      <p
        className="text-m text-textlight absolute bottom-6 left-5"
        onClick={handleSignOut}
      >
        Log Out
      </p>
    </main>
  );
}
