import React, {FC, Fragment, ReactNode} from "react";
import styled from "styled-components";
import {Cluster as MapboxCluster, Marker} from "react-mapbox-gl";
import {ReactComponent as BluePinIcon} from "../CustomIcons/assets/ico-pin-blue.svg";
import {Props as MarkerProps} from "react-mapbox-gl/lib-esm/marker";
import clusterIcon from "../CustomIcons/assets/visual-glow-blue.svg";
import clusterPins from "../CustomIcons/assets/ico-pins-light.svg";
import {ServiceType} from "../Service";

// MARKER

const StyledIcon = styled.div`
  width: 38px;
  height: 50px;
`;

type MapPinProps = {};
const MapPin: FC<MarkerProps & MapPinProps> = (props) => {
  return (
    <Marker anchor="bottom" {...props} style={{ pointerEvents: "none" }}>
      <StyledIcon as={BluePinIcon} data-cy="map-pin" />
    </Marker>
  );
};

const StyledClusterMarker = styled(Marker)`
  cursor: pointer;
`;

const StyledCluster = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledShape = styled.div`
  height: 32px;
  border-radius: 17.6px;
  margin-bottom: -18px;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 12px;
  position: relative;
`;
const StyledTriangle = styled.div`
  width: 16px;
  height: 12px;
  transform: translate(50%, 0) rotate(-180deg);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  background-color: #ffffff;
  position: absolute;
  top: 95%;
  right: 50%;
`;

const StyledCount = styled.div`
  font-size: 14px;
  font-weight: bold;
  text-align: right;
  color: #666666;
`;

const ClusterMarker: FC<{
  coordinates: [number, number];
  count: number;
  isCounting?: boolean;
}> = ({ coordinates, count, isCounting }) => {
  return (
    <StyledClusterMarker coordinates={coordinates}>
      <StyledCluster>
        <StyledShape>
          <img src={clusterPins} alt="" />
          <StyledCount>{count}</StyledCount>
          <StyledTriangle />
        </StyledShape>
        <img src={clusterIcon} alt="" />
      </StyledCluster>
    </StyledClusterMarker>
  );
};

const clusterMarker = (
  coordinates: [number, number],
  count: number
): ReactNode => (
  <ClusterMarker
    key={JSON.stringify(coordinates)}
    coordinates={coordinates}
    count={count}
  />
);

const Cluster: FC<{ services: Array<ServiceType> }> = ({ services }) => {
  const addresses = services.map((service) => service.addresses);
  return (
    <Fragment>
      <MapboxCluster
        ClusterMarkerFactory={clusterMarker}
        radius={30}
        zoomOnClick
        zoomOnClickPadding={40}
      >
        {addresses.flat().map((address) => {
          return (
            address && (
              <MapPin
                coordinates={[address.longitude, address.latitude]}
                key={address?.uuid}
              />
            )
          );
        })}
      </MapboxCluster>
    </Fragment>
  );
};

export default Cluster;
