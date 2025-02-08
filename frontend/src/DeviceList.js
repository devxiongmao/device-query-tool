import { Link } from "react-router-dom";

const DeviceList = ({devices, title}) => {
    return ( 
        <>
            <h1>{title}</h1>
            <div className="device-list">
                {devices.map((device) => (
                    <div className="device-preview" key={device.id}>
                        <Link to={`/devices/${device.id}`}>
                            <h2>{device.vendor} {device.model_num} {device.market_name}</h2>
                        </Link>
                    </div>
                ))}
            </div>
        </>
     );
}
 
export default DeviceList;