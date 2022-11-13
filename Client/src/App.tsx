import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Navigation from "./components/Navigation";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
