import "./ProjectCard.css";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

interface ProjectCardProps {
  name: string;
  url: string;
  description: string;
  imageUrl: string;
}

const ProjectCard = (props: ProjectCardProps) => {
  return (
    <Link to={props.url}>
      <Grid container direction={"column"} className={"projectCard"}>
        {props.imageUrl ? <img src={props.imageUrl} /> : <></>}
        <Grid item>
          <h1>{props.name}</h1>
        </Grid>
        <Grid item>
          <h3>{props.description}</h3>
        </Grid>
      </Grid>
    </Link>
  );
};

export default ProjectCard;
