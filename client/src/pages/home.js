import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const WEEKDAYS = ["montag", "dienstag", "mittwoch", "donnerstag", "freitag"];

export const Home = () => {
  const [cookies] = useCookies(["access_token"]);

  const [availableEssen, setAvailableEssen] = useState([]);
  const [availableEssenPlans, setAvailableEssenPlans] = useState([]);
  const [editMode, setEditMode] = useState(false); // Bearbeitungsmodus hinzufügen
  const [editedPlan, setEditedPlan] = useState(null); // Bearbeiteten Essensplan speichern
  const [searchWeekNumber, setSearchWeekNumber] = useState("");

  const [essenPlan, setEssenplan] = useState({
    wochenNummer: 0,
    essenProWoche: {
      montag: null,
      dienstag: null,
      mittwoch: null,
      donnerstag: null,
      freitag: null,
    },
  });

  const handleWeekNumberChange = (event) =>
    setEssenplan({
      essenProWoche: {
        montag: null,
        dienstag: null,
        mittwoch: null,
        donnerstag: null,
        freitag: null,
      },
      wochenNummer: parseInt(event.target.value),
    });

  const handleMealChange = (event) =>
    setEssenplan({
      ...essenPlan,
      essenProWoche: {
        ...essenPlan.essenProWoche,
        [event.target.id]: { id: event.target.value },
      },
    });

  const handleEditClick = (plan) => {
    setEditMode(true);
    setEditedPlan(plan);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedPlan(null);
  };

  const handleUpdatePlan = async () => {
    try {
      // Sende die aktualisierten Daten an die Datenbank
      await axios.put(
        `http://localhost:3001/essenplan/${editedPlan._id}`,
        editedPlan,
        {
          headers: { authorization: cookies.access_token },
        }
      );

      // Aktualisiere die Liste der Essenspläne
      fetchAvailableEssenPlans();

      // Beende den Bearbeitungsmodus
      setEditMode(false);
      setEditedPlan(null);
    } catch (err) {
      console.error(err);
      // Handle Fehler
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      // Sende eine Anfrage an die API, um den Essensplan zu löschen
      await axios.delete(`http://localhost:3001/essenplan/${planId}`, {
        headers: { authorization: cookies.access_token },
      });

      // Aktualisiere die Liste der Essenspläne
      fetchAvailableEssenPlans();
    } catch (err) {
      console.error(err);
      // Handle Fehler
    }
  };

  const filteredEssenPlans = availableEssenPlans.filter((plan) =>
    searchWeekNumber === ""
      ? true
      : plan.wochenNummer === parseInt(searchWeekNumber)
  );

  const fetchAvailableEssen = async () => {
    try {
      const response = await axios.get("http://localhost:3001/essen");
      setAvailableEssen(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAvailableEssenPlans = async () => {
    try {
      const response = await axios.get("http://localhost:3001/essenplan");
      setAvailableEssenPlans(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("http://localhost:3001/essenplan", essenPlan, {
        headers: { authorization: cookies.access_token },
      });
      console.log("handleSubmit-Essensplan", essenPlan);
      alert("Essensplan erstellt");
    } catch (err) {
      if (err.response.request.status === 400) {
        alert(
          "Der Essensplan wurde bereits für diese Woche erstellt. Bitte ändere ihn."
        );
      }
      if (err.response.request.status === 500) {
        console.error(err);
        alert(
          "Beim Speichern des Essensplans ist ein unbekannter Fehler aufgetreten."
        );
      }
    }
  };

  const getEssenNameById = (id) => {
    const selectedEssen = availableEssen.find((essen) => essen._id === id);
    return selectedEssen ? selectedEssen.name : "Nicht ausgewählt";
  };

  useEffect(() => {
    fetchAvailableEssen();
    fetchAvailableEssenPlans();
  }, []);

  /*   const handleSelectChange = (day, selectedValue) => {
    setSelectedEssen((prevSelectedEssen) => ({
      ...prevSelectedEssen,
      [day]: selectedValue,
    }));
  }; */

  useEffect(() => {
    console.log("USEFFECT essenPlan", essenPlan);
  }, [essenPlan]);

  useEffect(() => {
    console.log("USEFFECT availableEssen", availableEssen);
  }, [availableEssen]);

  return (
    <div className="create-essenplan">
      <h2>Essensplan erstellen</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="wochenNummer">Wochennummer</label>
        <input
          type="number"
          id="wochenNummer"
          name="wochenNummer"
          onChange={handleWeekNumberChange}
        />
        <div>
          {essenPlan.wochenNummer > 0 &&
            WEEKDAYS.map((day) => (
              <div
                key={day}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <label htmlFor={day} style={{ textTransform: "capitalize" }}>
                  {day}
                </label>
                <select id={day} name={day} onChange={handleMealChange}>
                  {availableEssen.map((essen) => (
                    <option key={essen._id} value={essen._id}>
                      {essen.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </div>
        <button type="submit">Essensplan erstellen</button>
      </form>
      <div>
        <h2>Erstellte Essenspläne</h2>
        <input
          type="text"
          placeholder="Wochennummer filtern"
          value={searchWeekNumber}
          onChange={(e) => setSearchWeekNumber(e.target.value)}
        />
        <ul>
          {filteredEssenPlans.map((plan) => (
            <li key={plan._id}>
              <p>Wochennummer: {plan.wochenNummer}</p>
              <p>Essen pro Woche:</p>
              <ul>
                {WEEKDAYS.map((day) => (
                  <li key={day}>
                    {day}:{" "}
                    {editMode && editedPlan && editedPlan._id === plan._id ? (
                      <select
                        value={editedPlan.essenProWoche[day]?.id || ""}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedName = getEssenNameById(selectedId);
                          setEditedPlan({
                            ...editedPlan,
                            essenProWoche: {
                              ...editedPlan.essenProWoche,
                              [day]: { id: selectedId, name: selectedName },
                            },
                          });
                        }}
                      >
                        <option value="">Nicht ausgewählt</option>
                        {availableEssen.map((essen) => (
                          <option key={essen._id} value={essen._id}>
                            {essen.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      getEssenNameById(plan.essenProWoche[day]?.id) ||
                      "Nicht ausgewählt"
                    )}
                  </li>
                ))}
              </ul>
              {editMode && editedPlan && editedPlan._id === plan._id ? (
                <div>
                  <button onClick={handleUpdatePlan}>Speichern</button>
                  <button onClick={handleCancelEdit}>Abbrechen</button>
                </div>
              ) : (
                <div>
                  <button onClick={() => handleEditClick(plan)}>
                    Bearbeiten
                  </button>
                  <button onClick={() => handleDeletePlan(plan._id)}>
                    Löschen
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
