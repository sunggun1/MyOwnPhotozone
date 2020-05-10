import React, { useState, useRef } from "react";
import useSwr from "swr";
import GoogleMapReact from "google-map-react";
import useSupercluster from "use-supercluster";
const fetcher = (...args) => fetch(...args).then(response => response.json());

const Marker = ({ children }) => children;

export default function Map(){
    const mapRef = useRef();
    const [zoom, setZoom] = useState(10);
    const [bounds, setBounds] = useState(null);
  
    const url = "https://data.police.uk/api/crimes-street/all-crime?lat=52.629729&lng=-1.131592&date=2019-10";
    const { data, error } = useSwr(url,  fetcher );
    const crimes = data && !error ? data.slice(0, 200) : [];

  return (
    <div style={{hegiht:"100vh", width:"100%"}}>
      <GoogleMapReact 
        bootstrapURLKeys={{ key : 'AIzaSyAf-aClEvdGqO749dVaU8caSb-9l1bTggk' }}
        defaultCenter= {{lat:52, lng:-1}}
        defaultZoom={10}
        >
        {crimes.map(crime =>(
          <Marker 
            key={crime.id} 
            lat={crime.location.latitude} 
            lng={crime.location.longitude}
          >
            <button className="crime-maker">
              <img src="../../../public/custody.svg" alt="crime doesn't pay"/>
            </button>
          </Marker>
        ))}
      </GoogleMapReact>
    </div>
  );
}