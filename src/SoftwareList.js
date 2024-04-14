import useFetch from './useFetch';

const SoftwareList = ({deviceId}) => {
    const { data: softwares, isPending, error } = useFetch("http://localhost:3001/api/v1/devices/" + deviceId + '/softwares');
    return ( 
        <div className="software-list">
            { isPending && <div>Loading...</div> }
            { error && <div>{ error }</div>}
            {softwares && softwares.map((software) => (
                <div className="software-preview" key={software.id}>
                    <h4>{software.name}</h4>
                </div>
            ))}

        </div>
     );
}
 
export default SoftwareList;