import { Link } from 'react-router-dom';

const NavigationBar = () => {
	return (
        <nav className="navbar">
            <h1>Device Query Tool</h1>
            <div className="links">
                <Link to="/">Device List</Link>
                <Link to="/new">Add Data</Link>
            </div>
        </nav>

    );
}

export default NavigationBar;