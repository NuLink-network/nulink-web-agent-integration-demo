import { axios } from "@/lib/axios";
import { FileData } from '@/types';
import { sendMessageSync } from "@/lib/sendMessage";
import { isMock } from "@/config";

export type ApplyPermissionForFilesRequestOptions = {
  fileIds: string[];
  usageDays?: number;
};
export type FilesForApprovedAsUserRequestOptions = {
  pageIndex?: number;
  pageSize?: number;
};

export type FilesForUploaderRequestOptions = {
  fileId: string;
  fileName: string;
};

export type ApprovedFileContentByFileIdRequestOptions = {
  fileId: string;
  fileName: string;
};

export const applyPermissionForFiles: (args: ApplyPermissionForFilesRequestOptions) => Promise<any> = async (
  data
): Promise<FileData> => {
  return isMock
    ? await axios.post('/file/apply')
    : await sendMessageSync("applyPermissionForFiles", data);
};

export const getFilesForApprovedAsUser: (args: FilesForApprovedAsUserRequestOptions) => Promise<any> = async (
  data
): Promise<FileData> => {
  return isMock
    ? await axios.post('/file/approvedFiles')
    : await sendMessageSync("getFilesForApprovedAsUser", data);
}

export const getApprovedFileContentByFileId: (args: ApprovedFileContentByFileIdRequestOptions) => Promise<any> = async (
  data
): Promise<string> => {
  return isMock
    ? await axios.post('/file/approvedFileContent')
    : await sendMessageSync("getApprovedFileContentByFileId", data);
}


export const getContentAsUploaderByFileId: (args: ApprovedFileContentByFileIdRequestOptions) => Promise<any> = async (
  data
): Promise<string> => {
  return isMock
    ? await axios.post('/file/uploaderFileContent')
    : await sendMessageSync("getContentAsUploaderByFileId", data);
}

