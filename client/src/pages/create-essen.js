import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { LanguageContext } from "../App";

export const CreateEssen = () => {
  const [language, setLanguage] = useContext(LanguageContext);
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);
  const isAdminLoggedIn = !!localStorage.getItem("userID");

  const [essen, setEssen] = useState({
    name: "",
    preis: 0,
    art: "vegetarisch",
    userOwner: userID,
  });

  //const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEssen({ ...essen, [name]: value });
  };

  const onSubmit = async (event) => {
    //event.preventDefault();
    try {
      await axios.post("http://localhost:3001/essen", essen, {
        headers: { authorization: cookies.access_token },
      });
      alert("Essen hinzugefügt");
      //navigate("/create-essen");
    } catch (err) {
      console.error(err);
    }
  };

  //Hier ist der Teil der für die hinzugefügten Essen verantwortlich ist
  const [savedEssen, setSavedEssen] = useState([]);

  useEffect(() => {
    const fetchEssen = async () => {
      try {
        const response = await axios.get("http://localhost:3001/essen");
        setSavedEssen(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEssen();
  }, []);

  // Hier ist der Teil zum bearbeiten von Essen
  const [editEssen, setEditEssen] = useState(null);

  const startEditing = (essen) => {
    setEditEssen(essen);
  };

  const handleEditChange = (event, id, field) => {
    const newValue = event.target.value;
    setSavedEssen((prevEssen) =>
      prevEssen.map((essen) =>
        essen._id === id ? { ...essen, [field]: newValue } : essen
      )
    );
  };

  const saveEdit = async (id) => {
    const editedEssen = savedEssen.find((essen) => essen._id === id);

    try {
      await axios.put(`http://localhost:3001/essen/${id}`, editedEssen, {
        headers: { authorization: cookies.access_token },
      });
      setEditEssen(null);
    } catch (err) {
      console.error(err);
    }
  };

  //Hier ist der Teil zum Löschen eines Essens
  const deleteEssen = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/essen/${id}`, {
        headers: { authorization: cookies.access_token },
      });
      // Update the UI or fetch updated data from the server if needed
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="create-essen">
      {isAdminLoggedIn && (
        <>
          <h2> {language === "DE" ? "Essen hinzufügen" : "Add Meal"}</h2>
          <form onSubmit={onSubmit}>
            <label htmlFor="name"> {language === "DE" ? "Name" : "Name"}</label>
            <input type="text" id="name" name="name" onChange={handleChange} />
            <label htmlFor="preis">
              {language === "DE" ? "Preis" : "Price"} €
            </label>
            <input
              type="number"
              id="preis"
              name="preis"
              step="0.01"
              onChange={handleChange}
            />
            <label htmlFor="art">Art</label>
            <select id="art" name="art" onChange={handleChange}>
              <option value="vegetarisch">
                {language === "DE" ? "vegetarisch" : "vegetarian"}
              </option>
              <option value="vegan">vegan</option>
              <option value="mit Fleisch">
                {language === "DE" ? "mit Fleisch" : "with Meat"}
              </option>
            </select>
            <button type="submit">
              {" "}
              {language === "DE" ? "Essen hinzufügen" : "Add Meal"}
            </button>
          </form>
        </>
      )}
      <div>
        <h2>{language === "DE" ? "Hinzugefügte Essen" : "Added Meals"}</h2>
        <ul>
          {savedEssen.map((savedEssen) => {
            if (savedEssen._id === "64fb8c6b96dc8ae1a1a1ceb4") {
              return null;
            }
            return (
              <li key={savedEssen._id}>
                {editEssen === savedEssen._id ? (
                  // Formular zum Bearbeiten anzeigen
                  <div>
                    <input
                      type="text"
                      value={savedEssen.name}
                      onChange={(e) =>
                        handleEditChange(e, savedEssen._id, "name")
                      }
                    />
                    <input
                      type="number"
                      value={savedEssen.preis}
                      step="0.01"
                      onChange={(e) =>
                        handleEditChange(e, savedEssen._id, "preis")
                      }
                    />
                    <select
                      value={savedEssen.art}
                      onChange={(e) =>
                        handleEditChange(e, savedEssen._id, "art")
                      }
                    >
                      <option value="vegetarisch">
                        {language === "DE" ? "vegetarisch" : "vegetarian"}
                      </option>
                      <option value="vegan">vegan</option>
                      <option value="mit Fleisch">
                        {language === "DE" ? "mit Fleisch" : "with Meat"}
                      </option>
                    </select>
                    <button onClick={() => saveEdit(savedEssen._id)}>
                      {language === "DE" ? "Speichern" : "Save"}
                    </button>
                  </div>
                ) : (
                  // Anzeigen im Standardformat
                  <div>
                    <h2>{savedEssen.name}</h2>
                  </div>
                )}
                <p>
                  {language === "DE" ? "Preis" : "Price"}: {savedEssen.preis} €
                </p>
                <p>Art: {savedEssen.art} </p>
                {isAdminLoggedIn && (
                  <>
                    <button onClick={() => startEditing(savedEssen._id)}>
                      {language === "DE" ? "Bearbeiten" : "Update"}
                    </button>
                    <button onClick={() => deleteEssen(savedEssen._id)}>
                      {language === "DE" ? "Löschen" : "Delete"}
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
