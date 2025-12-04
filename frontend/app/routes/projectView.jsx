import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { supabase } from "../supabaseClient.js";
import Button from "../components/Button.jsx";

export default function ProjectView() {
  const { projectId } = useParams(); // dynamic param from URL
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  //Fetch project
  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", projectId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setProject(data);
      setLoading(false);
    };

    fetchProject();
  }, [projectId]);

  if (loading) return <p>Loading project...</p>;
  if (!project) return <p>Project not found.</p>;

  const handleStartSession = () => {
    // Navigate to session page, e.g., `/project/:id/session`
    navigate(`/project/${projectId}/session`);
  };

  return (
    <div className="flex flex-col gap-6 px-5 items-center w-full mt-10">
      <h1 className="text-heading1">{project.name}</h1>
      <Button gradient="gradient7" onClick={handleStartSession}>
        Start Session
      </Button>
    </div>
  );
}
