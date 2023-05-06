import { sendMessageSync } from "@/lib/sendMessage";
import { MESSAGE_PAY_KEY, setMessageKey } from "@/lib/sendMessage";
export type ApplyStatusOfBeingApprovedOrApprovedRequestOptions = {
  applyId: string;
};
export const IsApplyStatusOfBeingApprovedOrApproved: (
  args: ApplyStatusOfBeingApprovedOrApprovedRequestOptions,
) => Promise<boolean> = async (data) => {
  const key = await setMessageKey(MESSAGE_PAY_KEY);
  return await sendMessageSync("IsApplyStatusOfBeingApprovedOrApproved", {
    key,
    ...data,
  });
};
