import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Essensplan } from "./pages/essensplan";
import { Auth } from "./pages/auth";
import { CreateEssen } from "./pages/create-essen";
import { Essensbewertung } from "./pages/saved-recepies";
import { Navbar } from "./components/navbar";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Essensplan />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/create-essen" element={<CreateEssen />} />
          <Route path="/saved-recepies" element={<Essensbewertung />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
