import { sendMessageSync } from "@/lib/sendMessage";
import { MESSAGE_CONNECT_KEY, setMessageKey } from "@/lib/sendMessage";

export const connectWallet = async (): Promise<any> => {
  const key = await setMessageKey(MESSAGE_CONNECT_KEY);
  return await sendMessageSync("connectWallet", { key });
};
/**
 * Because of `isUserLogined` is the same as `getLoginedUserInfo` api, so abandon it.
 * @returns {Object} user
 */
export const isUserLogined = async (): Promise<any> => {
  return await sendMessageSync("isUserLogined", {});
};