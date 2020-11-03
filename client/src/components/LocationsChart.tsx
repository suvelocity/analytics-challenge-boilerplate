import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from "@react-google-maps/api";
import { Location, geolocationChartResponse, GeoLocation } from "models";
import { httpClient } from "utils/asyncUtils";
import { Height } from "@material-ui/icons";

const REACT_APP_GOOGLE_MAP_KEY: string = process.env.REACT_APP_GOOGLE_MAP_KEY!;
const center: Location = { lat: 20, lng: 20 };
const LocationChart: React.FC = () => {
  const [data, setData] = useState<GeoLocation[]>([]);

  const fetchData = async () => {
    const { data } = await httpClient.get(`/events/chart/geolocation`);
    console.log(data);
    setData(data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <LoadScript googleMapsApiKey={REACT_APP_GOOGLE_MAP_KEY}>
        <div>hello</div>
        <GoogleMap
          center={center}
          zoom={3}
          mapContainerStyle={{ height: "600px", width: "1000px" }}
        >
          {data?.map((locationRes: GeoLocation, i: number) => (
            <Marker key={`marker${i}`} position={locationRes.location} />
          ))}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default LocationChart;
