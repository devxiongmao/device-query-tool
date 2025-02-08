import { Link } from "react-router-dom";

const NotFound = () => {
    return ( 
        <div className="not-found">
            <h2>Sorry, not found!</h2>
            <p>The requested page cannot be found</p>
            <Link to="/">Back to the Homepage</Link>
        </div>
     );
}
 
export default NotFound;