import { sendMessageSync } from "@/lib/sendMessage";
import { isNotEmptyObject } from "@/utils/null";
import { storage } from "@/utils/storage";
import { message as Message } from "antd";
import { getData as getIPFSData, setData as setIPFSData } from "@/utils/ipfs";

export const ACCOUNT = "account";

export const getLoginedUserInfo = async (): Promise<any> => {
  const result = await sendMessageSync("getLoginedUserInfo", {});
  //result is null or result data
  return isNotEmptyObject(result) ? result : null;
};

export const cache_user_key: string = "userinfo";

export const cache_user_details_key: string = "userdetails";

export const getUserCache = (showMessage: boolean = true) => {
  const userInfo = storage.getItem(cache_user_key);

  if (!userInfo) {
    if (showMessage) {
      // Message.warn("please login nulink-agent first 2222222222");
    }

    return null;
  }
  return userInfo;
};

export const getUserInfo = async () => {
  // const user = await getLoginedUserInfo();
  const user = storage.getItem(cache_user_key);
  if (!!user) {
    storage.setItem(cache_user_key, user);
  } else {
    storage.removeItem(cache_user_key);
  }

  return user;
};

export const getUserDetailInfo = async () => {
  const userDetailInfo = await sendMessageSync("getUserDetails", {});

  if (!!userDetailInfo) {
    storage.setItem(cache_user_details_key, userDetailInfo);
  } else {
    storage.removeItem(cache_user_details_key);
  }

  return userDetailInfo;
};

export const getUserDetailCache = (showMessage: boolean = true) => {
  const userInfo = storage.getItem(cache_user_details_key);

  if (!userInfo) {
    if (showMessage) {
      // Message.warn("please login nulink-agent first  3333333333333");
    }

    return null;
  }
  return userInfo;
};

export const getAvatarBase64String = async (cid: string) => {
  if (!cid) {
    return null;
  }
  try {
    let avatarStr = storage.getItem(cid);
    if (!!avatarStr) {
      // console.log("getAvatarBase64String cache avatarImageBase64 ", avatarImageBase64.toString());
      return avatarStr;
    }
    const avatarImageBase64 = await getIPFSData(cid);
    // console.log("getAvatarBase64String avatarImageBase64 ", avatarImageBase64.toString());
    avatarStr = avatarImageBase64.toString();

    //The maximum value of localstorage in a domain name is 5M
    try {
      storage.setItem(cid, avatarStr);
    } catch (error) {
      console.info("setAvatarBase64String set cache error: ", error);
    }

    return avatarStr;
  } catch (error) {
    console.error("getAvatarBase64String error: ", error);
    return null;
  }
};

export const setAvatarBase64String = async (avatar: string) => {
  if (!avatar) {
    return null;
  }

  // console.log("avatar: ", avatar.toString());

  try {
    //save avatar ipfs data
    const cid = await setIPFSData(avatar);

    //The maximum value of localstorage in a domain name is 5M
    try {
      storage.setItem(cid, avatar);
    } catch (error) {
      console.info("setAvatarBase64String set cache error: ", error);
    }

    return cid;
  } catch (error) {
    console.error("setAvatarBase64String error: ", error);
    return null;
  }
};
