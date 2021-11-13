import React from "react";
import { Card, Col, Row, Tabs } from "antd";
import styled from "styled-components/macro";
import faker from "faker";
import { times } from "lodash";
import { healthCareProviders } from "../../constants";

const service = () => ({
  title: faker.name.findName(),
  location: faker.address.cityName(),
  description: faker.commerce.productDescription(),
  images: ["https://joeschmoe.io/api/v1/random"],
});

const StyledContainer = styled.div`
  padding: 100px 2vw;
`;

const StyledCol = styled(Col)`
  margin-bottom: 10px;
`;
const Search = () => {
  return (
    <StyledContainer>
      <Tabs>
        {healthCareProviders.map((provider) => (
          <Tabs.TabPane key={provider.value} tab={provider.label}>
            <Row justify={"space-around"} gutter={1}>
              {times(25, () => service()).map((service, index) => (
                <StyledCol span={5} key={index}>
                  <Card
                    cover={<img src={service.images[0]} alt="" />}
                    hoverable
                  >
                    <Card.Meta
                      title={service.title}
                      description={service.description}
                    />
                  </Card>
                </StyledCol>
              ))}
            </Row>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </StyledContainer>
  );
};

export default Search;
