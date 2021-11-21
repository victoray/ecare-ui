import Header from "../../components/Header";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { Appointment } from "../Calendar";
import { useApi } from "../../api";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/auth";
import Talk from "talkjs";
import styled from "styled-components";
import { Avatar, Button, Space, Typography } from "antd";
import { Inbox } from "talkjs/all";
import { UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import daily from "../../api/daily";

const StyledInbox = styled.div`
  height: calc(100vh - 213px);
  width: 100vw;
`;

const StyledChatHeader = styled.div`
  height: 60px;
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #d0d8dc;
`;

const StyledTitle = styled.div`
  width: 35vw;
  border-right: 1px solid #d0d8dc;

  padding: 10px;
`;
const StyledChatControls = styled.div`
  flex-basis: calc(65vw - 20px);

  padding: 10px;

  display: flex;

  & > *:last-child {
    margin-left: auto;
  }
`;

const InboxView = () => {
  const api = useApi();
  const user = useSelector(selectUser);
  const isPatient = user?.roleType === "patient";
  const [userToAppointment, setUserToAppointment] = useState<Record<string, string>>({});
  const [otherUser, setOtherUser] = useState<null | Talk.UserData>(null);

  const params = useMemo(() => {
    const params: Record<any, any> = {};
    if (user?.roleType === "provider") {
      params.careProvider = user.uuid;
    } else {
      params.patient = user?.uuid;
    }

    return params;
  }, [user]);

  const {data: appointments} = useQuery(
      ["appointments", api, params],
      () =>
          api.client.get<any, Array<Appointment>>("/appointments/", {
            params,
          }),
      {
        enabled: Boolean(user),
        onSuccess(response) {
          const mapping: Record<string, string> = {};
          response.forEach((appointment) => {
            mapping[appointment.patient.uuid] = appointment.uuid;
            mapping[appointment.careProvider.uuid] = appointment.uuid;
          });
          setUserToAppointment(mapping);
        },
      }
  );

  const container = useRef<HTMLDivElement>();
  const inbox = useRef<Inbox>();

  const handleVideoCall = async (appointmentId: string) => {
    const w: any = window;

    const callFrame = w.DailyIframe.createFrame({
      showLeaveButton: true,
      showFullscreenButton: true,
    });
    let url = "";

    try {
      const response = await daily.get(`/rooms/${appointmentId}`);
      url = response.data.url;
    } catch (e: any) {
      if (e?.response?.status === 404) {
        const response = await daily.post(`/rooms/`, {
          name: appointmentId,
          privacy: "public",
          properties: {
            start_audio_off: true,
            start_video_off: true,
            enable_prejoin_ui: false,
          },
        });
        url = response.data.url;
      }
    }

    callFrame.join({
      url,
      userName: user?.legalName
    });

    callFrame.on("left-meeting", () => callFrame.destroy());
  };

  useEffect(() => {
    if (container.current && appointments && user) {
      const windowInstance: any = window;
      Talk.ready
          .then(() => {
            const me = new Talk.User({
              id: user.uuid,
              name: user.legalName || "",
              email: user.email,
              role: "default",
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
                role: "default",
                photoUrl:
                    otherUser.profileImage || 'https://joeschmoe.io/api/v1/random"',
              });

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
              showChatHeader: false,
              showFeedHeader: false,
              showMobileBackButton: false,
            });
            inbox.current?.mount(document.getElementById("talkjs-container"));

            inbox.current?.on("conversationSelected", function ({others}) {
              const other = others?.[0];
              setOtherUser(other || null);
            });
          })
          .catch((e) => console.error(e));
    }
  }, [appointments, isPatient, user]);

  return (
      <div>
        <Header showSearch={false} position={"relative"}/>

        <StyledChatHeader>
          <StyledTitle>
            <Typography.Title level={3}>Chats</Typography.Title>
          </StyledTitle>
          {otherUser && (
              <StyledChatControls>
                <Space align={"center"}>
                  <Avatar
                      size={36}
                      src={
                        otherUser?.photoUrl || "https://joeschmoe.io/api/v1/random"
                      }
                      icon={<UserOutlined/>}
                  />
                  <Typography.Text strong>{otherUser?.name}</Typography.Text>
                </Space>

                <Space>
                  <Button
                      icon={<VideoCameraOutlined/>}
                      type={"link"}
                      onClick={() =>
                          user && handleVideoCall(userToAppointment[otherUser.id])
                      }
                  />
                </Space>
              </StyledChatControls>
          )}
        </StyledChatHeader>

        <div className="chatbox-container">
          <StyledInbox
              id={"talkjs-container"}
              ref={(node) => {
                if (node) {
                  container.current = node;
                }
              }}
          />
        </div>
      </div>
  );
};

export default InboxView;
