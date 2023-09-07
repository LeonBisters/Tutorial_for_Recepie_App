import React, { useEffect, useState } from "react";
import axios from "axios";

export const Essensbewertung = () => {
  const [availableEssen, setAvailableEssen] = useState([]);
  const [selectedEssen, setSelectedEssen] = useState(null);
  const [userBewertungen, setUserBewertungen] = useState({}); // Bewertungen des Benutzers

  const [ratingData, setRatingData] = useState({
    stars: "1",
    comment: "",
  });

  const fetchAvailableEssen = async () => {
    try {
      const response = await axios.get("http://localhost:3001/essen");
      setAvailableEssen(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserBewertungen = async () => {
    try {
      const response = await axios.get("http://localhost:3001/bewertungen");
      // Annahme: Bewertungen sind nach Essen und Benutzer gruppiert
      // Hier wird angenommen, dass der Benutzer mit einer ID authentifiziert ist.
      setUserBewertungen(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAvailableEssen();
    fetchUserBewertungen();
  }, []);

  const handleRate = async () => {
    try {
      const response = await axios.post("http://localhost:3001/bewertungen", {
        essenId: selectedEssen._id,
        stars: ratingData.stars,
        comment: ratingData.comment,
      });

      console.log("Bewertung gespeichert:", response.data);

      // Schließen Sie das Bewertungsfenster und setzen Sie die Bewertungsdaten zurück
      setRatingData({
        stars: "1",
        comment: "",
      });

      // Deselektieren Sie das ausgewählte Essen
      setSelectedEssen(null);
    } catch (err) {
      console.error("Fehler beim Speichern der Bewertung:", err);
    }
  };

  return (
    <div className="essensBewertung">
      <h2>Essensbewertung</h2>
      <ul>
        {availableEssen.map((essen) => {
          return (
            <li key={essen._id}>
              {essen.name}
              <button onClick={() => setSelectedEssen(essen)}>Bewerten</button>
            </li>
          );
        })}
      </ul>

      {/* Zeigen Sie das Bewertungsfenster an, wenn ein Essen ausgewählt wurde */}
      {selectedEssen && (
        <div className="rating-modal">
          <h3>Bewertung abgeben für {selectedEssen.name}</h3>
          <div>
            <label>Sterne (1-5):</label>
            <select
              value={ratingData.stars}
              onChange={(e) =>
                setRatingData({
                  ...ratingData,
                  stars: e.target.value,
                })
              }
            >
              <option value="1">1 Stern</option>
              <option value="2">2 Sterne</option>
              <option value="3">3 Sterne</option>
              <option value="4">4 Sterne</option>
              <option value="5">5 Sterne</option>
            </select>
          </div>
          <div>
            <label>Kommentar:</label>
            <textarea
              value={ratingData.comment}
              onChange={(e) =>
                setRatingData({
                  ...ratingData,
                  comment: e.target.value,
                })
              }
              required
            />
          </div>
          <button onClick={handleRate}>Bewertung abschicken</button>
        </div>
      )}
      <div>
        <h2>Vergangene Bewertungen</h2>
      </div>
    </div>
  );
};
