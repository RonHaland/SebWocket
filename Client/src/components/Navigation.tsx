import { Outlet } from "react-router-dom";

const Navigation = () => {
  return (
    <>
      <div
        className="navBar"
        style={{
          width: "100vw",
          height: "10em",
          backgroundColor: "rgb(28, 2, 36)",
          borderRadius: "0 0 7px 7px",
        }}
      >
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
      </div>
      <Outlet />
    </>
  );
};

export default Navigation;
