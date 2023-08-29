import {Link} from 'react-router-dom';

export const Navbar = () => {
    return(
        <div className="navbar">
            <Link to="/"> Home </Link>
            <Link to="/create-recepie"> CreateRecepie </Link>
            <Link to="/saved-recepies"> SavedRecepies </Link>
            <Link to="/auth"> Login/Register </Link>
        </div>
    ) 
}