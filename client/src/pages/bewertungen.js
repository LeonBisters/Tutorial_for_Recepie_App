import React, { useEffect, useState } from "react";
import axios from "axios";

export const Essensbewertung = () => {
  const [availableEssen, setAvailableEssen] = useState([]);
  const [selectedEssen, setSelectedEssen] = useState(null);
  const [bewertungen, setBewertungen] = useState([]);
  const [selectedBewertung, setSelectedBewertung] = useState(null);

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

  const fetchBewertungen = async () => {
    try {
      const response = await axios.get("http://localhost:3001/bewertungen");
      setBewertungen(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAvailableEssen();
    fetchBewertungen();
  }, []);

  const getEssenName = (essenId) => {
    const selectedEssen = availableEssen.find((essen) => essen._id === essenId);
    return selectedEssen ? selectedEssen.name : "Unbekanntes Essen";
  };

  const groupAndSortBewertungen = () => {
    const groupedBewertungen = {};

    bewertungen.forEach((bewertung) => {
      const essenName = getEssenName(bewertung.essenId);
      if (!groupedBewertungen[essenName]) {
        groupedBewertungen[essenName] = [];
      }
      groupedBewertungen[essenName].push(bewertung);
    });

    // Sortieren Sie die Speisen alphabetisch nach dem Namen
    const sortedSpeisen = Object.keys(groupedBewertungen).sort();

    // Erstellen Sie ein Array mit den gruppierten und sortierten Bewertungen
    const sortedBewertungen = sortedSpeisen.map((essenName) => ({
      essenName,
      bewertungen: groupedBewertungen[essenName],
    }));

    return sortedBewertungen;
  };

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

      // Deselektieren Sie das ausgewählte Essen und die Bewertung
      setSelectedEssen(null);
      setSelectedBewertung(null);

      // Aktualisieren Sie die Bewertungen, um die neuen Daten anzuzeigen
      fetchBewertungen();
    } catch (err) {
      console.error("Fehler beim Speichern der Bewertung:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/bewertungen/${selectedBewertung._id}`,
        {
          stars: ratingData.stars,
          comment: ratingData.comment,
        }
      );

      console.log("Bewertung aktualisiert:", response.data);

      // Schließen Sie das Bewertungsfenster und setzen Sie die Bewertungsdaten zurück
      setRatingData({
        stars: "1",
        comment: "",
      });

      // Deselektieren Sie das ausgewählte Essen und die Bewertung
      setSelectedEssen(null);
      setSelectedBewertung(null);

      // Aktualisieren Sie die Bewertungen, um die neuen Daten anzuzeigen
      fetchBewertungen();
    } catch (err) {
      console.error("Fehler beim Aktualisieren der Bewertung:", err);
    }
  };

  const sortedBewertungen = groupAndSortBewertungen();

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
          <h3>
            {selectedBewertung
              ? "Bewertung bearbeiten"
              : `Bewertung abgeben für ${selectedEssen.name}`}
          </h3>
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
          {selectedBewertung ? (
            <button onClick={handleUpdate}>Aktualisieren</button>
          ) : (
            <button onClick={handleRate}>Bewertung abschicken</button>
          )}
        </div>
      )}
      <div>
        <h2>Vergangene Bewertungen</h2>
        <ul>
          {sortedBewertungen.map((speise) => (
            <li key={speise.essenName}>
              <h3>{speise.essenName}</h3>
              <ul>
                {speise.bewertungen.map((bewertung) => (
                  <li key={bewertung._id}>
                    <p>Sterne: {bewertung.stars}</p>
                    <p>Kommentar: {bewertung.comment}</p>
                    <button onClick={() => setSelectedBewertung(bewertung)}>
                      Bearbeiten
                    </button>
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
