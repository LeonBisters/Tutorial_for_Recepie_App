import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Essensplan } from "./pages/essensplan";
import { Auth } from "./pages/auth";
import { Essen } from "./pages/essen";
import { Essensbewertung } from "./pages/bewertungen";
import { Navbar } from "./components/navbar";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Essensplan />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/essen" element={<Essen />} />
          <Route path="/bewertungen" element={<Essensbewertung />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
