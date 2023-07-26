import { useTranslation } from "react-i18next";
import { Avatar, Image } from "antd";
import defaultAvatar from "@/assets/img/avatar.png";
import { useState } from "react";

type ProfilePictureProps = {
  className?: string | undefined;
  onSuccess: (...args: any[]) => any;
  newAvatar?: string | ''; //The image from the parent compontent
};

export const ProfilePicture = ({ onSuccess, newAvatar, className }: ProfilePictureProps) => {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState(defaultAvatar);
  const changeAvatar = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function(e) {
      const url = e.target?.result as string;
      setAvatar(url); //url and avatar are all base64 strings of image
      onSuccess(url);
    };
  };

  const inputStyle = {
    opacity: 0,
  };
  return (
    <>
      <div className={`${className} relative`}>
        <span className="block absolute avater-text pointer">
          {t<string>("member-center-modify-data-change-avatar")}
          <input className="absolute avater-text" type="file" accept="image/*" style={inputStyle} onChange={changeAvatar} />
        </span>
        <Avatar size={100} src={newAvatar || avatar} />
      </div>
    </>
  )
};