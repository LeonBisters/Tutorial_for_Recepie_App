import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { LanguageContext } from "../App";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const isAdminLoggedIn = !!localStorage.getItem("userID");
  const [language, setLanguage] = useContext(LanguageContext);

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    navigate("/auth");
  };

  const handleLanguageChange = (event) => {
    window.localStorage.setItem("language", event.target.value);
    setLanguage(event.target.value);
  };

  useEffect(() => {
    if (!isAdminLoggedIn) {
      window.localStorage.setItem("loggedOutID", crypto.randomUUID());
    }
    /* window.localStorage.setItem("language", language); */
  }, []);

  return (
    <div className="navbar">
      <select value={language} onChange={handleLanguageChange}>
        <option>DE</option>
        <option>EN</option>
      </select>
      <Link to="/"> {language === "DE" ? "Essensplan" : "Mealplan"} </Link>
      <Link to="/create-essen"> {language === "DE" ? "Essen" : "Meals"} </Link>
      <Link to="/bewertungen">
        {" "}
        {language === "DE" ? "Essensbewertung" : "Meal Ratings"}{" "}
      </Link>
      {!cookies.access_token ? (
        <Link to="/auth"> Login </Link>
      ) : (
        <button onClick={logout}>Logout</button>
      )}
    </div>
  );
};
