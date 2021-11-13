import React from "react";
import ReactMapboxGl, { MapContext } from "react-mapbox-gl";
import ZoomControl from "./ZoomControl";

const Mapbox = ReactMapboxGl({
  accessToken:
    "pk.eyJ1IjoidmlrdG9yYXkiLCJhIjoiY2tnNnJ5cjloMDBkODJwbjQ1YWFlemtzZyJ9._s3-KMEJMsGmiABI1m3mMw",
});

const Map = () => {
  return (
    <Mapbox
      style="mapbox://styles/mapbox/streets-v9"
      containerStyle={{
        height: "100%",
        width: "100%",
      }}
      center={[9.08, 8.67]}
      zoom={[6]}
    >
      <MapContext.Consumer>
        {(map) => (
          <>
            <ZoomControl map={map} />
          </>
        )}
      </MapContext.Consumer>
    </Mapbox>
  );
};

export default Map;
