import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {Home} from "./pages/home";
import {Auth} from "./pages/auth";
import {CreateRecepie} from "./pages/create-recepie";
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
          <Route path="/create-recepie" element={<CreateRecepie/>} />
          <Route path="/saved-recepies" element={<SavedRecipes/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
