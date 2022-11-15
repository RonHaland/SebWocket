import ProjectCard from "../components/ProjectCard";

interface Project {
  name: string;
  url: string;
  description: string;
}

const Projects = () => {
  const projectList = [
    { url: "/AddessBook", name: "Address book" },
    { url: "/Astar", name: "A-Star Algo" },
    {
      url: "/Boat",
      name: "Handdrawn boat battle",
      description: "Concept for a game with handdrawn graphics",
    },
  ] as Project[];

  return (
    <>
      <h1>Projects</h1>
      {projectList.map((p, i) => (
        <ProjectCard key={i} description={p.description} name={p.name} url={p.url} imageUrl={""} />
      ))}
    </>
  );
};

export default Projects;
