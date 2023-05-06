import imgUrl from "@/assets/img/default5.png";
import avatarImgUrl from "@/assets/img/avatar.png";
export const defaultImageHandler = (event) => {
  const img = event.srcElement;
  img.src = imgUrl;
  img.onerror = null;
};
export const defaultImage = imgUrl;
export const defaultAvatarImage = avatarImgUrl;
