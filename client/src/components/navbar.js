import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    navigate("/auth");
  };

  return (
    <div className="navbar">
      <Link to="/"> Essensplan </Link>
      <Link to="/create-essen"> Essen </Link>
      <Link to="/bewertungen"> Essensbewertung </Link>
      {!cookies.access_token ? (
        <Link to="/auth"> Login </Link>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
    </div>
  );
};
