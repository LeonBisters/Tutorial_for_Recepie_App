import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const WEEKDAYS = ["montag", "dienstag", "mittwoch", "donnerstag", "freitag"];

export const Home = () => {
  const [cookies] = useCookies(["access_token"]);

  const [availableEssen, setAvailableEssen] = useState([]);
  const [availableEssenPlans, setAvailableEssenPlans] = useState([]);

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
        <ul>
          {availableEssenPlans.map((plan) => (
            <li key={plan._id}>
              <p>Wochennummer: {plan.wochenNummer}</p>
              <p>Essen pro Woche:</p>
              <ul>
                {WEEKDAYS.map((day) => (
                  <li key={day}>
                    {day}:{getEssenNameById(plan.essenProWoche[day]?.id)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
