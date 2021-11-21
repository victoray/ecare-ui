/* eslint-disable react/style-prop-object */
import React, {FC} from "react";
import ReactMapboxGl, {MapContext} from "react-mapbox-gl";
import ZoomControl from "./ZoomControl";
import {ServiceType} from "../../../components/Service";
import Cluster from "../../../components/Map/Cluster";

const Mapbox = ReactMapboxGl({
  accessToken: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || "",
});

const Map: FC<{ services: Array<ServiceType> }> = ({ services }) => {
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

      <Cluster services={services} />
    </Mapbox>
  );
};

export default Map;
