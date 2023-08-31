import { useEffect, useState } from "react";
import axios from 'axios';
import {useCookies} from 'react-cookie';

export const Home = () => {
    const [cookies, _] = useCookies(["access_token"]);
    const [selectedEssen, setSelectedEssen] = useState({
        montag: null,
        dienstag: null,
        mittwoch: null,
        donnerstag: null,
        freitag: null
    });

    const [essenPlan, setEssenplan] = useState({
        wochenNummer: 0,
        essenProWoche: selectedEssen,
    });

    const handleChange = (event) => {
        const {name, value} = event.target;
        setEssenplan({ ...essenPlan, [name]: value});
    };

    const [availableEssen, setAvailableEssen] = useState([]);

    useEffect(() => {
        fetchAvailableEssen();
    }, []);

    const fetchAvailableEssen = async () => {
        try {
            const response = await axios.get("http://localhost:3001/essen");
            setAvailableEssen(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectChange = (day, selectedValue) => {
        setSelectedEssen(prevSelectedEssen => ({
            ...prevSelectedEssen,
            [day]: selectedValue
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await axios.post("http://localhost:3001/essenplan", essenPlan, {headers: {authorization: cookies.access_token}});
            alert("Essensplan erstellt");
        } catch (err) {
            console.error(err);
        }
    };

    return (
            <div className="create-essenplan">
                <h2>Essensplan erstellen</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="wochenNummer">Wochennummer</label>
                    <input type="number" id="wochenNummer" name="wochenNummer" onChange={handleChange}/>
                    <div>
                        {Object.keys(selectedEssen).map(day => (
                            <div key={day}>
                                <label htmlFor={day}>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                                <select id={day} name={day}  onChange={handleChange}>
                                    <option value={null}>Kein Essen ausgewählt</option>
                                    {availableEssen.map(essen => (
                                        <option key={essen._id} value={essen._id}>{essen.name}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                    <button type="submit">Essensplan erstellen</button>
                </form>
            </div>
    );
};


