import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Home} from "./pages/home";
import {Auth} from "./pages/auth";
import {CreateEssen} from "./pages/create-essen";
import {SavedRecipes} from "./pages/saved-recepies";
import {Navbar} from './components/navbar';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/auth" element={<Auth/>} />
          <Route path="/create-essen" element={<CreateEssen/>} />
          <Route path="/saved-recepies" element={<SavedRecipes/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
