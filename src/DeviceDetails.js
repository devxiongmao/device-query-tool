import { useParams } from 'react-router-dom';
import SoftwareList from './SoftwareList';
import useFetch from './useFetch';
import { Link } from 'react-router-dom';


const DeviceDetails = () => {
    const { id } = useParams();
    const { data: device, isPending, error } = useFetch("http://localhost:3001/api/v1/devices/" + id);

    return ( 
        <div className="device-details">
            { isPending && <div>Loading...</div> }
            { error && <div>{ error }</div>}
            { device && (
                <div>
                    <h2>{device.vendor} {device.model_num} {device.market_name}</h2>
                    <SoftwareList deviceId={id} />
                    <Link to={"/devices/" + device.id + "/softwares/new"}>Add Software</Link>
                </div>)
            }
        </div>
     );
}
 
export default DeviceDetails;