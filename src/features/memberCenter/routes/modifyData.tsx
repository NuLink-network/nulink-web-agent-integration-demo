import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, InputRef } from "antd";
import { ProfilePicture } from "../components/ProfilePicture";
import { useEffect, useRef, useState } from "react";
import { verifyUrl } from "@/utils/format";
import dayjs from "dayjs";
import { nanoid } from "nanoid";

import "../assets/modifyData.less";
// import {
// primaryBtnStyle as primaryBtn,
// primaryDisableBtnStyle as primaryDisableBtn,
// defaultBtnStyle as defaultBtn,
// } from "@/components/Button";
import { TextAreaRef } from "antd/lib/input/TextArea";
import { storage } from "@/utils/storage";
import { connectWallet } from "@/features/auth/api/connectWallet";
import { message as Message } from "antd";
import { sendMessageSync } from "@/lib/sendMessage";
import Emitter from "@/lib/emitter";
import { USERINFO_UPDATE } from "@/lib/emitter-events";
import {
  getAvatarBase64String,
  setAvatarBase64String,
} from "@/features/auth/api/getLoginedUserInfo";
import OvalButton from "@/components/Button/OvalButton";
import { getUserInfo, updateUserInfo } from "../api/account";

export const ModifyData = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState("");
  const [user, setUser] = useState(null);
  const [submitEnable, setSubmitEnable] = useState(true);
  const [nicknameStatus, setNicknameStatus] = useState<any>("");
  const [nicknameHint, setNicknameHint] = useState("account1");

  // I don't care about the onchange event Input, so I don't want to use onchange listening because it's inefficient
  const [nickname, setNickname] = useState("");
  const [userSite, setUserSite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [profile, setProfile] = useState("");

  // const inputRefNickname = useRef<InputRef>(null);
  // const inputRefUserSite = useRef<InputRef>(null);
  // const inputRefTwitter = useRef<InputRef>(null);
  // const inputRefInstagram = useRef<InputRef>(null);
  // const inputRefFacebook = useRef<InputRef>(null);
  // const textAreaRefProfile = useRef<TextAreaRef>(null);

  const handleNicknameChange = (event) => {
    const name = event.target.value;
    if (!name) {
      setNicknameStatus("error");
      setNicknameHint("name be not empty");
    } else {
      setNicknameStatus("");
      setNicknameHint("");
    }
    setNickname(name);
  };

  const _back = () => {
    navigate(-1);
  };

  useEffect(() => {
    (async () => {
      //get user info
      const user = storage.getItem("userinfo");
      setUser(user);
      if (!user) {
        return;
      }
      // antd input value not update http://lijian.store/react-hooks-antd-design%E9%87%8Cinput%E7%9A%84%E5%80%BC%E5%8F%98%E5%8C%96%E4%B8%8D%E6%9B%B4%E6%96%B0/
      console.log("user: ", !!user);
      const { data: userDetailInfo } = await getUserInfo({
        account_id: user.accountId,
      });

      // const userDetailInfo = await sendMessageSync("getUserDetails", {});
      setNickname(userDetailInfo.name);
      setUserSite(userDetailInfo.user_site || "");
      setTwitter(userDetailInfo.twitter || "");
      setInstagram(userDetailInfo.instagram || "");
      setFacebook(userDetailInfo.facebook || "");
      setProfile(userDetailInfo.profile || "");

      // (inputRefUserSite.current as any).input.value =
      //   userDetailInfo.user_site || "";
      // (inputRefTwitter.current as any).input.value =
      //   userDetailInfo.twitter || "";
      // (inputRefInstagram.current as any).input.value =
      //   userDetailInfo.instagram || "";
      // (inputRefFacebook.current as any).input.value =
      //   userDetailInfo.facebook || "";
      // (textAreaRefProfile.current as any).resizableTextArea.textArea.value =
      //   userDetailInfo.profile || "";

      if (!!userDetailInfo.avatar) {
        const avatarStr = await getAvatarBase64String(userDetailInfo.avatar);
        if (!!avatarStr) {
          setAvatar(avatarStr);
        }
      }
    })();
  }, []);

  const changeProfilePicture = (avatarImageBase64: string) => {
    // console.log("change avatar: ", avatarImageBase64.toString());
    setAvatar(avatarImageBase64);
  };
  /**
   * submit modify user profile form
   */
  const submitHandler = async () => {
    // console.log("inputRefNickname:", inputRefNickname.current?.input?.value);
    // console.log(
    //   "textAreaRefProfile:",
    //   textAreaRefProfile.current?.resizableTextArea?.textArea.value,
    // );
    const user = storage.getItem("userinfo");
    let data = {
      account_id: user.accountId,
      name: nickname, //inputRefNickname.current?.input?.value,
      user_site: userSite, //inputRefUserSite.current?.input?.value,
      twitter: twitter, //inputRefTwitter.current?.input?.value,
      instagram: instagram, //inputRefInstagram.current?.input?.value,
      facebook: facebook, //inputRefFacebook.current?.input?.value,
      profile: profile, //textAreaRefProfile.current?.resizableTextArea?.textArea.value,
      timestamp: dayjs().valueOf(),
    };

    if (!!avatar) {
      const avatarCid = await setAvatarBase64String(avatar);
      data["avatar"] = avatarCid;
    }

    const userInfo = storage.getItem("userinfo");
    setUser(userInfo);

    if (!user) {
      return;
    }

    if (userSite && !verifyUrl(userSite)) {
      Message.warning(
        `${t<string>("member-center-modify-data-pls-tip")} userSite ${t<string>(
          "member-center-modify-data-info-tip",
        )}`,
      );
      return;
    }

    if (twitter && !verifyUrl(twitter)) {
      Message.warning(
        `${t<string>("member-center-modify-data-pls-tip")} twitter ${t<string>(
          "member-center-modify-data-info-tip",
        )}`,
      );
      return;
    }

    if (instagram && !verifyUrl(instagram)) {
      Message.warning(
        `${t<string>(
          "member-center-modify-data-pls-tip",
        )} instagram ${t<string>("member-center-modify-data-info-tip")}`,
      );
      return;
    }

    if (facebook && !verifyUrl(facebook)) {
      Message.warning(
        `${t<string>("member-center-modify-data-pls-tip")} facebook ${t<string>(
          "member-center-modify-data-info-tip",
        )}`,
      );
      return;
    }

    //TODO: save user info
    await updateUserInfo(data);

    //avatar: string
    //update header avatar
    Emitter.emit(USERINFO_UPDATE, {
      avatar: avatar,
      name: nickname,
      userSite: userSite,
      twitter: twitter,
      instagram: instagram,
      facebook: facebook,
      profile: profile,
    });

    Message.success("upload success");
    setTimeout(() => {
      _back();
    }, 1000 * 2);
  };
  /**
   * cancel form
   */
  const cancelHandler = () => {
    // TODO
  };

  return (
    <div className="modify_data bg-white">
      <ProfilePicture
        className="text-center mart-30 marb-24"
        onSuccess={changeProfilePicture}
        newAvatar={avatar}
      />
      <Form
        name="editDataForm"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        initialValues={{ remember: true }}
        onFinish={submitHandler}
        onFinishFailed={cancelHandler}
        autoComplete="off"
      >
        <Form.Item
          label={t<string>("member-center-modify-data-nickname")}
          className="height-50"
          // rules={[{ required: true, message: 'Please input your nickname!' }]}
        >
          <Input
            // ref={inputRefNickname}
            className="height-50"
            onChange={handleNicknameChange}
            status={nicknameStatus}
            value={nickname}
            placeholder={nicknameHint}
          />
        </Form.Item>

        <Form.Item
          label={t<string>("member-center-modify-data-user-site")}
          className="height-50"
        >
          <Input
            /* ref={inputRefUserSite} */ className="height-50"
            value={userSite}
            onChange={(e) => setUserSite(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={t<string>("member-center-modify-data-twitter")}
          className="height-50"
        >
          <Input
            /* ref={inputRefTwitter} */ className="height-50"
            value={twitter}
            onChange={(e) => setTwitter(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={t<string>("member-center-modify-data-instagram")}
          className="height-50"
        >
          <Input
            /* ref={inputRefInstagram} */ className="height-50"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={t<string>("member-center-modify-data-facebook")}
          className="height-50"
        >
          <Input
            /* ref={inputRefFacebook} */ className="height-50"
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
          />
        </Form.Item>

        <Form.Item
          label={t<string>("member-center-modify-data-personal-profile")}
          className="height-110"
        >
          <Input.TextArea
            /* ref={textAreaRefProfile} */ className="min-height-110"
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
          />
        </Form.Item>
        <div className="button-group">
          <Form.Item wrapperCol={{ offset: 8, span: 8 }}>
            <OvalButton
              className="marr-20"
              title={t<string>("member-center-modify-data-cancel")}
              onClick={_back}
            />
            <OvalButton
              title={t<string>("member-center-modify-data-submit")}
              disabled={!submitEnable}
              htmlType="submit"
            />
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};
