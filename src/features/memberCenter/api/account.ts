import { axios } from "@/lib/axios";
import { FileData } from '@/types';
import { post } from '@/lib/request'
import { sendMessageSync } from "@/lib/sendMessage";
import { isMock } from "@/config";
import { BigNumber } from "ethers";

export type AccountUploadedFilesRequestOptions = {
  fileName?: string;
  pageIndex?: number;
  pageSize?: number;
};

export type PolicyServerFeeRequestOptions = {
  startSeconds?: number; // start time
  endSeconds?: number; // end time
  ursulaShares?: number; // ursulan, pre of shares
};

export type FilesInfoRequestByStatusRequestOptions = {
  fileId?: string;
  proposerId?: string;
  fileOwnerId?: string;
  applyId?: string;
  status?: number;
  pageIndex?: number;
  pageSize?: number;
};
export type RefuseApplicationOfUseFilesRequestOptions = {
  applyId: string;
  remark?: string;
};

export type FilesByStatusForAllApplyAsPublisherRequestOptions = {
  status?: number;
  pageIndex?: number;
  pageSize?: number;
}

export const getAccountUploadedFiles: (args: AccountUploadedFilesRequestOptions) => Promise<any> = async (
  data
): Promise<FileData> => {
  return isMock
    ? await axios.post('/account/uploadedFiles')
    : await sendMessageSync("getAccountUploadedFiles", data);
};


export const refuseApplicationOfUseFiles: (args: RefuseApplicationOfUseFilesRequestOptions) => Promise<any> = async (
  data
): Promise<unknown> => {
  return isMock
    ? await axios.post('/account/refuse')
    : await sendMessageSync("refuseApplicationOfUseFiles", data);
};

export const getFilesByStatusForAllApplyAsPublisher: (args: FilesByStatusForAllApplyAsPublisherRequestOptions) => Promise<any> = async (
  data
): Promise<unknown> => {
  return await axios.post('/apply/list', data)
};

export const getUserInfo = async (params) => await post('/account/get', params)

export const updateUserInfo = async (params) => await post('/third-party/account/update', params)