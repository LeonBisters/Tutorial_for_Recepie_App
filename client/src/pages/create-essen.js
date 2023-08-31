import {useEffect, useState} from "react";
import axios from 'axios';
import { useGetUserID } from "../hooks/useGetUserID";
import {useNavigate} from 'react-router-dom';
import {useCookies} from 'react-cookie';


export const CreateEssen = () => {
    const userID = useGetUserID();
    const [cookies, _] = useCookies(["access_token"]);

    const [essen, setEssen] = useState({
        name:"",
        preis: 0,
        art: "vegetarisch",
        userOwner: userID,
    });

    //const navigate = useNavigate();

    const handleChange = (event) => {
        const {name, value} = event.target;
        setEssen({ ...essen, [name]: value});
    };


    const onSubmit = async (event) => {
        //event.preventDefault();
        try {
            await axios.post("http://localhost:3001/essen", essen, {headers: {authorization: cookies.access_token}});
            alert("Essen hinzugefügt");
            //navigate("/create-essen");
        } catch (err) {
            console.error(err);
        }

    }


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
        }

        fetchEssen();
    }, []);


    // Hier ist der Teil zum bearbeiten von Essen
    const [editEssen, setEditEssen] = useState(null);

    const startEditing = (essen) => {
        setEditEssen(essen);
    };

    const handleEditChange = (event, id, field) => {
        const newValue = event.target.value;
        setSavedEssen(prevEssen => prevEssen.map(essen => 
            essen._id === id ? { ...essen, [field]: newValue } : essen
        ));
    };
    
    const saveEdit = async (id) => {
        const editedEssen = savedEssen.find(essen => essen._id === id);
    
        try {
            await axios.put(`http://localhost:3001/essen/${id}`, editedEssen, { headers: { authorization: cookies.access_token } });
            setEditEssen(null); 
        } catch (err) {
            console.error(err);
        }
    };

    //Hier ist der Teil zum Löschen eines Essens
    const deleteEssen = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/essen/${id}`, { headers: { authorization: cookies.access_token } });
            // Update the UI or fetch updated data from the server if needed
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };
    

    return (
        <div className="create-essen">
            <h2> Essen hinzufügen</h2>
            <form onSubmit={onSubmit}>
                <label htmlFor="name"> Name</label>
                <input type="text" id="name" name="name" onChange={handleChange}/>
                <label htmlFor="preis">Preis €</label>
                <input type="number" id="preis" name="preis" step="0.01" onChange={handleChange}/>
                <label htmlFor="art">Art</label>
                <select id="art" name="art" onChange={handleChange}>
                    <option value="vegetarisch">Vegetarisch</option>
                    <option value="vegan">Vegan</option>
                    <option value="mit Fleisch">Mit Fleisch</option>
                </select>
                <button type="submit"> Essen hinzufügen</button>
            </form>
            <div>
                <h2>Hinzugefügte essen</h2>
                <ul>
                    {savedEssen.map((savedEssen) => (
                        <li key={savedEssen._id}>
                            {editEssen === savedEssen._id ? (
                                // Formular zum Bearbeiten anzeigen
                                <div>
                                    <input type="text" value={savedEssen.name} onChange={(e) => handleEditChange(e, savedEssen._id, 'name')} />
                                    <input type="number" value={savedEssen.preis} step="0.01" onChange={(e) => handleEditChange(e, savedEssen._id, 'preis')} />
                                    <select value={savedEssen.art} onChange={(e) => handleEditChange(e, savedEssen._id, 'art')}>
                                        <option value="vegetarisch">Vegetarisch</option>
                                        <option value="vegan">Vegan</option>
                                        <option value="mit Fleisch">Mit Fleisch</option>
                                    </select>
                                    <button onClick={() => saveEdit(savedEssen._id)}>Speichern</button>
                                </div>
                            ) : (
                                // Anzeigen im Standardformat
                                <div>
                                    <h2>{savedEssen.name}</h2>
                                </div>
                            )}
                            <p>Preis: {savedEssen.preis} € </p>
                            <p>Art: {savedEssen.art} </p>
                            <button onClick={() => startEditing(savedEssen._id)}>Bearbeiten</button>
                            <button onClick={() => deleteEssen(savedEssen._id)}>Löschen</button> 
                        </li>
                    ))}
                </ul>
            </div>
        </div>
        
    );
};