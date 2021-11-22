import React, { FC, Fragment, useState } from "react";
import { useMutation } from "react-query";
import { getMapboxPlaces } from "api";
import { BluePinIcon } from "../CustomIcons";
import styled from "styled-components";
import { AutoComplete, Input, Space } from "antd";
import { MapBoxFeature } from "./Search";
import { SearchOutlined } from "@ant-design/icons";

const StyledAutoComplete = styled(AutoComplete)`
  width: 250px;
`;

const StyledInput = styled(Input)`
  height: 40px;
`;

const StyledLabel = styled(Space)`
  .anticon {
    font-size: 32px;
  }

  @media (max-width: 1098px) {
    width: calc(100vw - 500px);
  }
`;

type SearchProps = {
  onMouseEnter?(featureId: string): void;
  onMouseLeave?(featureId?: string): void;
  onSearchComplete?(features: Array<MapBoxFeature>): void;
  onSelect?(feature: MapBoxFeature): void;
  onDropdownVisibleChange?(opened: boolean): void;
  disabled?: boolean;
  defaultValue?: string;
  onClear?(): void;
  handleChange?(value: string): void;
  value?: string;
  bordered?: boolean;
};

const MapboxSearch: FC<SearchProps> = ({
  onMouseEnter,
  onMouseLeave,
  onSearchComplete,
  onSelect,
  onDropdownVisibleChange,
  disabled,
  onClear,
  handleChange,
  defaultValue,
  value,
  bordered = false,
}) => {
  const [suggestions, setSuggestions] = useState<Array<MapBoxFeature>>([]);

  const { mutate: searchMapboxPlaces } = useMutation(getMapboxPlaces, {
    onSuccess(response) {
      setSuggestions(response.data.features);
      onSearchComplete?.(response.data.features);
    },
  });

  const options = suggestions.map((suggestion, index) => ({
    value: suggestion.place_name,
    label: (
      <StyledLabel>
        <BluePinIcon />
        {suggestion.place_name}
      </StyledLabel>
    ),
    id: suggestion.id,
    "data-cy": `map-result-${index}`,
    feature: suggestion,
    onMouseEnter: () => onMouseEnter?.(suggestion.id),
    onMouseLeave: () => onMouseLeave?.(suggestion.id),
  }));

  return (
    <Fragment>
      <StyledAutoComplete
        options={options}
        value={value}
        disabled={disabled}
        onSearch={(value) => String(value).trim() && searchMapboxPlaces(value)}
        onSelect={(_, option) => onSelect?.(option.feature)}
        allowClear
        onClear={() => onClear?.()}
        onDropdownVisibleChange={onDropdownVisibleChange}
        defaultValue={defaultValue}
      >
        <StyledInput
          prefix={<SearchOutlined />}
          onChange={(event) => handleChange?.(event.target.value)}
          placeholder="Type an address..."
          data-cy="map-search"
          bordered={bordered}
        />
      </StyledAutoComplete>
    </Fragment>
  );
};

export default MapboxSearch;
