import "./Nav.css";
import { Grid } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

const Navigation = () => {
  return (
    <>
      <div
        className="navBar"
        style={{
          width: "100vw",
          backgroundColor: "rgb(50, 10, 70)",
          borderRadius: "0 0 7px 7px",
        }}
      >
        <Grid container direction={"column"} spacing={3}>
          <Grid item>
            <h1
              style={{
                fontWeight: "350",
                fontSize: "50px",
                letterSpacing: "5px",
                display: "inline-block",
                margin: "5px",
              }}
            >
              ronnyhaland
            </h1>
          </Grid>
          <Grid item>
            <Grid container direction={"row"} justifyContent={"flex-start"} alignItems={"flex-end"}>
              <Grid item>
                <Link to={"/"} className={"navLink"}>
                  Home
                </Link>
              </Grid>
              <Grid item>
                <Link to={"/blog"} className={"navLink"}>
                  Blog
                </Link>
              </Grid>
              <Grid item>
                <Link to={"/projects"} className={"navLink"}>
                  Projects
                </Link>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <Outlet />
    </>
  );
};

export default Navigation;
