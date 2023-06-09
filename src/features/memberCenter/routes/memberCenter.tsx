import { useEffect, useState } from "react";
import "../assets/index.less";
import "@/features/find/components/styles/dataIndicators.less";
import { useTranslation } from "react-i18next";
import { MyApply } from "../components/MyApply";
import { MyApprove } from "../components/MyApprove";
import imgUrl from "@/assets/img/avatar.png";
import { getUserCache } from "@/features/auth/api/getLoginedUserInfo";
import Emitter from "@/lib/emitter";
import { USERINFO_UPDATE } from "@/lib/emitter-events";
import Alert from "@/components/Layout/Alert";
import { AlertColor } from "@mui/material";

export const MemberCenter = () => {
  const [avatar] = useState(imgUrl);
  const [active, setActive] = useState("2");
  const [user, setUser] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);
  const [severity] = useState<AlertColor>("info");
  const [alertMessage] = useState<string>("");
  const { t } = useTranslation();
  const ContentComponent = () => {
    switch (active) {
      case "2":
        return <MyApply />;
      case "3":
        return <MyApprove />;
    }
  };

  const getUserInfo = async () => {
    const user = getUserCache();
    setUser(user);
  };

  useEffect(() => {
    Emitter.on(USERINFO_UPDATE, (userinfo) => {
      if (!userinfo) {
        return;
      }
    });
    window.setTimeout(async () => await getUserInfo(), 0);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Alert
        open={open}
        severity={severity}
        onClose={handleClose}
        message={alertMessage}
      />
      <div className="member_center">
        <div className="member_center_top">
          <div className="member_center_left">
            <div className="left_avatar">
              <div
                className="left_avatar_item"
                style={{ background: `url(${avatar})` }}
              />
            </div>
            <div className="member_introduction">
              <div className="member_introduction_name">
                <span>{user?.name}</span>
              </div>
              <div>{user?.accountAddress}</div>
            </div>
          </div>
        </div>
        <div className="member_center_tab">
          <div
            className={
              active === "2"
                ? "member_center_tab_item active"
                : "member_center_tab_item"
            }
            onClick={() => {
              setActive("2");
            }}
          >
            {t<string>("member-center-a-tab-2")}
            <div className="line"></div>
          </div>
          <div
            className={
              active === "3"
                ? "member_center_tab_item active"
                : "member_center_tab_item"
            }
            onClick={() => {
              setActive("3");
            }}
          >
            {t<string>("member-center-a-tab-3")}
            <div className="line"></div>
          </div>
        </div>
        <div className="member_center_content">{ContentComponent()}</div>
      </div>
    </>
  );
};
