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
import editUrl from "../assets/edit_icon.svg";
import OvalButton from "../../../components/Button/OvalButton";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../api/account";
import { getAvatarBase64String } from "@/features/auth/api/getLoginedUserInfo";
import {
  sendCustomTransaction
} from "@nulink_network/nulink-web-agent-access-sdk";
import {getData} from "@/utils/ipfs";

export const MemberCenter = () => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(imgUrl);
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

  const _getUserInfo = async () => {
    const user = getUserCache();
    const { data: userDetailInfo } = await getUserInfo({
      account_id: user.accountId,
    });
    if (!!userDetailInfo.avatar) {
      const avatarStr = await getAvatarBase64String(userDetailInfo.avatar);
      if (!!avatarStr) {
        setAvatar(avatarStr);
      }
    }
    setUser(userDetailInfo);
  };

  useEffect(() => {
    Emitter.on(USERINFO_UPDATE, (userinfo) => {
      if (!userinfo) {
        return;
      }
    });
    window.setTimeout(async () => await _getUserInfo(), 0);
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const sendTransaction = async () => {
    await sendCustomTransaction(sendTransactionCallBack, '0xeEFA1EADDEea7a3d9acf04D421bDb26a4725Faed', null, '10000000000000000')
  }

  const sendTransactionCallBack = async (data) => {
    try {
      console.log(data)
    } catch (error) {
      throw new Error("Decryption failed, Please try again");
    }
  };

  const editTitle = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img src={editUrl} alt="" />
        <span style={{ marginLeft: "10px" }}>Edit</span>
      </div>
    );
  };

  const sendTitle = () => {
    return (
        <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
        >
          <img src={editUrl} alt="" />
          <span style={{ marginLeft: "10px" }}>Send</span>
        </div>
    );
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
              <div>{user?.ethereum_addr}</div>
            </div>
            <OvalButton
              title={editTitle()}
              style={{ marginLeft: "10px" }}
              onClick={() => {
                navigate("/modifyData");
              }}
            />
            <OvalButton
                title={sendTitle()}
                style={{ marginLeft: "10px" }}
                onClick={sendTransaction}
            />
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
