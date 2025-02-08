import { useState } from "react";
import { useHistory } from "react-router-dom";
import useFetch from './useFetch';

const CreateFeature = () => {
    const [featureName, setFeature] = useState('');
    const [isPending, setIsPending ] = useState(false);
    const history = useHistory();

    const { data: features, isFeatureListPending, error } = useFetch(process.env.REACT_APP_BE_URL + "/api/v1/features");


    const handleFeatureSubmit = (e) => {
        e.preventDefault();

        const feature = {name: featureName};
        setIsPending(true);
        fetch(process.env.REACT_APP_BE_URL + "/api/v1/features", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(feature)
        }).then(() => {
            setIsPending(false);
            history.push("/")
        }).catch((err) => {
            console.log('Error: ', err)
        })
    }

    return (
        <div className="create-feature-page">
            {error && <div>{error}</div>}
            {isFeatureListPending && <div>Loading...</div>}
            {features && features.map((feature) => (
                    <div className="feature-preview" key={feature.id}>
                        <h2>{feature.name}</h2>
                    </div>
            ))}
            <br />
            <form onSubmit={handleFeatureSubmit}>
                <h2>Add a new feature</h2>
                <label>Feature Name</label>
                <br />
                <input
                    type="text"
                    required
                    value={featureName}
                    onChange={(e) => setFeature(e.target.value)}>    
                </input>
                <br />
                { !isPending && <button>Add Feature</button>}
                { isPending && <button disabled>Adding Feature...</button>}
            </form>
        </div>
      );
}
 
export default CreateFeature;