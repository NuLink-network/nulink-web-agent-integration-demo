import { axios } from "@/lib/axios";
import { FileData } from '@/types';
import { sendMessageSync } from "@/lib/sendMessage";
import { isMock } from "@/config";

export type PublishedPolicyInfosRequestOptions = {
  pageIndex?: number;
  pageSize?: number;
};

export type FilesInfoOfPolicyRequestOptions = {
  policyId: String;
  asPublisher?: Boolean;
  pageIndex?: number;
  pageSize?: number;
};

export const getPublishedPolicyInfos: (args: PublishedPolicyInfosRequestOptions) => Promise<any> = async (
  data
): Promise<FileData> => {
  return isMock
    ? await axios.post('/account/publishedPolicyInfos')
    : await sendMessageSync("getPublishedPolicyInfos", data);
};

export const getPolicyInfosAsUser: (args: PublishedPolicyInfosRequestOptions) => Promise<any> = async (
  data
): Promise<FileData> => {
  return isMock
    ? await axios.post('/account/policyInfosAsUser')
    : await sendMessageSync("getPolicyInfosAsUser", data);
};

export const getFilesInfoOfPolicy: (args: FilesInfoOfPolicyRequestOptions) => Promise<any> = async (
  data
): Promise<FileData> => {
  return isMock
    ? await axios.post('/account/policyInfosAsUser')
    : await sendMessageSync("getFilesInfoOfPolicy", data);
};
