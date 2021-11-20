import Header from "../../components/Header";
import React, { useEffect, useMemo, useRef } from "react";
import { useQuery } from "react-query";
import { Appointment } from "../Calendar";
import { useApi } from "../../api";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/auth";
import Talk from "talkjs";
import styled from "styled-components";

const StyledInbox = styled.div`
  height: calc(100vh - 163px);
`;

const Inbox = () => {
  const api = useApi();
  const user = useSelector(selectUser);
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

  const { data: appointments } = useQuery(
    ["appointments", api, params],
    () =>
      api.client.get<any, Array<Appointment>>("/appointments/", {
        params,
      }),
    { enabled: Boolean(user) }
  );

  const container = useRef<HTMLDivElement>();
  const inbox = useRef<HTMLDivElement>();

  useEffect(() => {
    if (container.current && appointments && user) {
      const windowInstance: any = window;
      Talk.ready
        .then(() => {
          const me = new Talk.User({
            id: user.uuid,
            name: user.legalName || "",
            email: user.email,
            photoUrl:
              user.profileImage || 'https://joeschmoe.io/api/v1/random"',
          });

          if (!windowInstance.talkSession) {
            windowInstance.talkSession = new Talk.Session({
              appId: "t6o0sxAD",
              me: me,
            });
          }

          const conversations = appointments.map((appointment) => {
            const otherUser = isPatient
              ? appointment.careProvider
              : appointment.patient;

            const other = new Talk.User({
              id: otherUser.uuid,
              name: otherUser.legalName || "",
              email: otherUser.email,
              photoUrl:
                otherUser.profileImage || 'https://joeschmoe.io/api/v1/random"',
            });

            // You control the ID of a conversation. oneOnOneId is a helper method that generates
            // a unique conversation ID for a given pair of users.
            const conversationId = Talk.oneOnOneId(me, other);

            const conversation =
              windowInstance.talkSession.getOrCreateConversation(
                conversationId
              );
            conversation.setParticipant(me);
            conversation.setParticipant(other);

            return conversation;
          });

          inbox.current = windowInstance.talkSession.createInbox({
            selected: conversations[0],
          });
          (inbox.current as any).mount(
            document.getElementById("talkjs-container")
          );
        })
        .catch((e) => console.error(e));
    }
  }, [appointments, isPatient, user]);

  return (
    <div>
      <Header showSearch={false} position={"relative"} />

      <StyledInbox
        id={"talkjs-container"}
        ref={(node) => {
          if (node) {
            container.current = node;
          }
        }}
      />
    </div>
  );
};

export default Inbox;
