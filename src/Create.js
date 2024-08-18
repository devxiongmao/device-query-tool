import { useState } from "react";
import { useHistory } from "react-router-dom";

const Create = () => {
    const [vendor, setVendor] = useState('');
    const [modelNum, setModelNum] = useState('');
    const [marketName, setMarketName] = useState('');
    const [isPending, setIsPending ] = useState(false);
    const history = useHistory();

    const handleDeviceSubmit = (e) => {
        e.preventDefault();

        const device = {vendor: vendor, model_num: modelNum, market_name: marketName};
        setIsPending(true);
        fetch("http://localhost:3001/api/v1/devices", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(device)
        }).then(() => {
            setIsPending(false);
            history.push("/")
        }).catch((err) => {
            console.log('Error: ', err)
        })
    }

    return (
        <div className="create-page">
            <form onSubmit={handleDeviceSubmit}>
                <h2>Add a new device</h2>
                <label>Vendor</label>
                <input
                    type="text"
                    required
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}>    
                </input>
                <br />
                <label>Model Number</label>
                <input
                    type="text"
                    required
                    value={modelNum}
                    onChange={(e) => setModelNum(e.target.value)}>    
                </input>
                <br />
                
                <label>Marketting Name</label>
                <input
                    type="text"
                    required
                    value={marketName}
                    onChange={(e) => setMarketName(e.target.value)}>    
                </input>
                { !isPending && <button>Add Device</button>}
                { isPending && <button disabled>Adding Device...</button>}
            </form>
        </div>
      );
}
 
export default Create;