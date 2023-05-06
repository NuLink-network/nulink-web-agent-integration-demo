import { sendMessageSync } from "@/lib/sendMessage";
import { MESSAGE_PAY_KEY, setMessageKey } from "@/lib/sendMessage";
export type UseWalletPayRequestOptions = {
  startSeconds: number;
  endSeconds: number;
  userAccountId: string,
  applyId: string,
  remark?: string,
  ursulaShares: number,
  ursulaThreshold: number
}
export const useWalletPay: (args: UseWalletPayRequestOptions) => Promise<boolean> = async (data) => {
  const key = await setMessageKey(MESSAGE_PAY_KEY);
  return await sendMessageSync("useWalletPay", { key, ...data });
};