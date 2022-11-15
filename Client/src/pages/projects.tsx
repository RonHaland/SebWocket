import "./projects.css";
import { Grid } from "@mui/material";
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
      <Grid
        container
        className="projectContainer"
        direction={"column"}
        spacing={4}
        alignContent={"flex-start"}
      >
        <Grid item>
          <h1>Projects</h1>
        </Grid>
        <Grid item>
          <Grid container direction={"column"} spacing={4} alignContent={"space-around"}>
            {projectList.map((p, i) => (
              <Grid item key={i}>
                <ProjectCard description={p.description} name={p.name} url={p.url} imageUrl={""} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Projects;
