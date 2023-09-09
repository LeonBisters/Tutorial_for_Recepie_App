import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const isAdminLoggedIn = !!localStorage.getItem("userID");

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    navigate("/auth");
  };

  useEffect(() => {
    if (!isAdminLoggedIn) {
      window.localStorage.setItem("loggedOutID", crypto.randomUUID());
    }
  }, []);

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
