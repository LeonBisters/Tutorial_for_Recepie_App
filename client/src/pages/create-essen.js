import {useState} from "react";
import axios from 'axios';
import { useGetUserID } from "../hooks/useGetUserID";
import {useNavigate} from 'react-router-dom';
import {useCookies} from 'react-cookie';


export const CreateEssen = () => {
    const userID = useGetUserID();
    const [cookies, _] = useCookies(["access_token"]);

    const [essen, setEssen] = useState({
        name:"",
        ingredients: [],
        instructions: "",
        imageUrl: "",
        cookingTime: 0,
        userOwner: userID,
    });

    const navigate = useNavigate();

    const handleChange = (event) => {
        const {name, value} = event.target;
        setEssen({ ...essen, [name]: value});
    };


    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:3001/essen", essen, {headers: {authorization: cookies.access_token}});
            alert("Essen hinzugefügt");
            navigate("/");
        } catch (err) {
            console.error(err);
        }

    }

    return (
        <div className="create-essen">
            <h2> Essen hinzufügen</h2>
            <form onSubmit={onSubmit}>
                <label htmlFor="name"> Name</label>
                <input type="text" id="name" name="name" onChange={handleChange}/>
                <label htmlFor="preis">Preis (Euro)</label>
                <input type="number" id="preis" name="preis" step="0.01" onChange={handleChange}/>
                <label htmlFor="art">Art</label>
                <select id="art" name="art" onChange={handleChange}>
                    <option value="vegetarisch">Vegetarisch</option>
                    <option value="vegan">Vegan</option>
                    <option value="mit Fleisch">Mit Fleisch</option>
                </select>
                <button type="submit"> Essen hinzufügen</button>
            </form>
        </div>
    );
};