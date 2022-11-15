import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Navigation from "./components/Navigation";
import Projects from "./pages/projects";
import Game from "./pages/game";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path="blog" element={<Home />} />
          <Route path="projects" element={<Projects />} />
          <Route path="game" element={<Game />} />

          <Route path="*" element={<h1>Not found</h1>} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
