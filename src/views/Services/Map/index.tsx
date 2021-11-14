/* eslint-disable react/style-prop-object */
import React from "react";
import ReactMapboxGl, {MapContext} from "react-mapbox-gl";
import ZoomControl from "./ZoomControl";

const Mapbox = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || "",
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
