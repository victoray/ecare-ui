import React, { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Header from "../../components/Header";
import styled from "styled-components/macro";
import { useQuery } from "react-query";
import { useApi } from "../../api";
import { useSelector } from "react-redux";
import { selectUser, User } from "../../store/auth";
import { useHistory } from "react-router";

const StyledContent = styled.div`
  padding: 10px;
`;

export type Appointment = {
  uuid: string;
  service: string;
  careProvider: User;
  patient: User;
  appointmentDate: string;
  url: string;
};
const Calendar = () => {
  const api = useApi();
  const user = useSelector(selectUser);
  const history = useHistory();
  const isPatient = user?.roleType === "patient";

  const params = useMemo(() => {
    const params: Record<any, any> = {};
    if (user?.roleType === "provider") {
      params.careProvider = user.uuid;
    } else {
      params.patient = user?.uuid;
    }

    return params;
  }, [user]);

  const { data: appointments = [] } = useQuery(
    ["appointments", api, params],
    () =>
      api.client.get<any, Array<Appointment>>("/appointments/", {
        params,
      }),
    { enabled: Boolean(user) }
  );

  return (
    <div>
      <Header position={"relative"} showSearch={false} />

      <StyledContent>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={appointments.map((appointment) => ({
            title: `Meeting with ${
              isPatient
                ? appointment.patient.legalName
                : appointment.careProvider.legalName
            }`,
            date: appointment.appointmentDate,
            id: appointment.uuid,
          }))}
          eventClick={(event) => history.push("/inbox")}
        />
      </StyledContent>
    </div>
  );
};

export default Calendar;
