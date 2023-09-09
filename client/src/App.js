import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Essensplan } from "./pages/essensplan";
import { Auth } from "./pages/auth";
import { CreateEssen } from "./pages/create-essen";
import { Essensbewertung } from "./pages/bewertungen";
import { Navbar } from "./components/navbar";
import { createContext, useEffect, useState } from "react";

export const LanguageContext = createContext(null);

function App() {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") === null
      ? "DE"
      : localStorage.getItem("language")
  );

  useEffect(() => {
    window.localStorage.setItem("language", language);
  }, []);

  return (
    <div className="App">
      <Router>
        <LanguageContext.Provider value={[language, setLanguage]}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Essensplan />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/create-essen" element={<CreateEssen />} />
            <Route path="/bewertungen" element={<Essensbewertung />} />
          </Routes>
        </LanguageContext.Provider>
      </Router>
    </div>
  );
}

export default App;
