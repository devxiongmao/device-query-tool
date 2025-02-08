import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";


const CreateSoftware = () => {
    const { id } = useParams();
    const [softwareName, setName] = useState('');
    const [platformName, setPlatform] = useState('');
    const [svnNum, setSvn] = useState(1);
    const [ptrcbNum, setPtcrb] = useState(0);
    const [isPending, setIsPending ] = useState(false);
    const history = useHistory();

    const handleSoftwareSubmit = (e) => {
        e.preventDefault();

        const software = {name: softwareName, platform: platformName, svn: svnNum, ptcrb: ptrcbNum, device_id: id};
        setIsPending(true);
        fetch(process.env.REACT_APP_BE_URL + "/api/v1/devices/" + id + '/softwares', {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(software)
        }).then(() => {
            setIsPending(false);
            history.push("/")
        }).catch((err) => {
            console.log('Error: ', err)
        })
    }

    return (
        <div className="create-software-page">
            <form onSubmit={handleSoftwareSubmit}>
                <h2>Add a new Software</h2>
                <label>Software Name</label>
                <input
                    type="text"
                    required
                    value={softwareName}
                    onChange={(e) => setName(e.target.value)}>    
                </input>
                <br />
                <label>Platform</label>
                <input
                    type="text"
                    required
                    value={platformName}
                    onChange={(e) => setPlatform(e.target.value)}>    
                </input>
                <br />

                <label>PTCRB</label>
                <input
                    type="text"
                    required
                    value={ptrcbNum}
                    onChange={(e) => setPtcrb(e.target.value)}>    
                </input>
                <br />

                <label>SVN</label>
                <input
                    type="text"
                    required
                    value={svnNum}
                    onChange={(e) => setSvn(e.target.value)}>    
                </input>
                <br />
                { !isPending && <button>Add Software</button>}
                { isPending && <button disabled>Adding Software...</button>}
            </form>
        </div>
      );
}
 
export default CreateSoftware;