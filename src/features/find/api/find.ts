import { axios } from "@/lib/axios";
import { post } from "@/lib/request";
import { FileData } from '@/types';
export type FileListRequestOptions = {
  fileName?: string;
  fileCategory?: string;
  fileType?: string;
  descOrder?: boolean;
  pageIndex?: number;
  pageSize?: number;
  include?: boolean;
};
export type FileDetailRequestOptions = {
  fileId: string;
  fileUserAccountId?: string;
}
export const getFileList: (args: any) => Promise<any> = async (
  data
): Promise<FileData> => {
  return await axios.post('/file/others-list', data)
};

export const getFileDetail: (args: FileDetailRequestOptions) => Promise<any> = async (
  data
): Promise<FileData> => {
  return await axios.post('/file/detail', data)
};

export const getFileListByCreator = async (params) => await post('/file/list', params)
