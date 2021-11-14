import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Header from "../../components/Header";
import styled from "styled-components/macro";

const StyledContent = styled.div`
  padding: 10px;
`;
const Calendar = () => {
  return (
    <div>
      <Header position={"relative"} showSearch={false} />

      <StyledContent>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={[
            { title: "Patient 1", date: "2021-11-14" },
            { title: "Patient 2", date: "2021-11-14" },
          ]}
        />
      </StyledContent>
    </div>
  );
};

export default Calendar;
