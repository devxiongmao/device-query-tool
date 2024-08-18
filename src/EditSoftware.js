import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import useFetch from './useFetch';


const EditSoftware = () => {
    const { id, sid } = useParams(); 

    const [softwareName, setName] = useState('');
    const [platformName, setPlatform] = useState('');
    const [svnNum, setSvn] = useState('');
    const [ptrcbNum, setPtcrb] = useState('');
    const [isSoftwarePending, setIsSoftwarePending ] = useState(false);
    const history = useHistory();

    const { data: software, isPending, error } = useFetch(
        "http://localhost:3001/api/v1/devices/" + id + "/softwares/" + sid
        )
    
    useEffect(() => {
        if (!isPending) {
            setName(software.name);
            setPlatform(software.platform);
            setSvn(software.svn);
            setPtcrb(software.ptcrb)
        }
    },[isPending])

    const handleSoftwareSubmit = (e) => {
        e.preventDefault();

        const software = {name: softwareName, platform: platformName, svn: svnNum, ptcrb: ptrcbNum, device_id: id};
        setIsSoftwarePending(true);
        fetch("http://localhost:3001/api/v1/devices/" + id + '/softwares/' + sid, {
            method: "PUT",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(software)
        }).then(() => {
            setIsSoftwarePending(false);
            history.push("/")
        }).catch((err) => {
            console.log('Error: ', err)
        })
    }

    return (
        <div className="create-software-page">
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            <form onSubmit={handleSoftwareSubmit}>
                <h2>Update a Software</h2>
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
                { !isSoftwarePending && <button>Update Software</button>}
                { isSoftwarePending && <button disabled>Adding Software...</button>}
                </form>
            </div>
      );
}
 
export default EditSoftware;