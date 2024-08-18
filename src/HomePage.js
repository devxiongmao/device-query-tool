import useFetch from './useFetch';

import DeviceList from './DeviceList';


const HomePage = () => {
    const { data: devices, isPending, error } = useFetch(process.env.REACT_APP_BE_URL + "/api/v1/devices")
    return ( 
        <div className="home-page">
            {error && <div>{error}</div>}
            {isPending && <div>Loading...</div>}
            {devices && <DeviceList devices={devices} title="Device List"/>}
        </div>
     );
}
 
export default HomePage;