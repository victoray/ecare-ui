import styled from "styled-components";
import { Map } from "mapbox-gl";
import React, { FC } from "react";
import { Button } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons/lib";

const ZOOM_DIFF = 0.5;

const StyledZoomControl = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  width: 40px;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.09), 0 3px 8px 0 rgba(0, 0, 0, 0.09);
  background-color: #ffffff;
  z-index: 5;
`;

type ZoomControlProps = {
  map?: Map;
};

const ZoomControl: FC<ZoomControlProps> = ({ map }) => {
  const onControlClick = (diff: number): void => {
    map?.zoomTo(map.getZoom() + diff);
  };

  return (
    <StyledZoomControl>
      <Button
        icon={<PlusOutlined />}
        onClick={() => onControlClick(ZOOM_DIFF)}
        type="text"
        block
        data-cy="zoom-in"
      />

      <Button
        icon={<MinusOutlined />}
        onClick={() => onControlClick(-ZOOM_DIFF)}
        type="text"
        block
        data-cy="zoom-out"
      />
    </StyledZoomControl>
  );
};

export default ZoomControl;
