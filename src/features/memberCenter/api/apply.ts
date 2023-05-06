import { axios } from "@/lib/axios";
import { sendMessageSync } from "@/lib/sendMessage";
import { isMock } from "@/config";

export type ApprovedFileContentByFileIdRequestOptions = {
  fileId: string
  fileName: string
}

export type FilesByStatusForAllApplyAsUserRequestOptions = {
  status: number;
  pageIndex?: number;
  pageSize?: number;
}

export const getApprovedFileContentByFileId: (args: ApprovedFileContentByFileIdRequestOptions) => Promise<any> = async (
  data
): Promise<unknown> => {
  return isMock
    ? await axios.post('/account/upload')
    : await sendMessageSync("getApprovedFileContentByFileId", data);
};

export const getFilesByStatusForAllApplyAsUser: (args: FilesByStatusForAllApplyAsUserRequestOptions) => Promise<any> = async (
  data
): Promise<unknown> => {
  return await axios.post('/apply/list', data)
};