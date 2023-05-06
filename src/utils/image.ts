import { getData as getIPFSData } from "./ipfs";

export const getThumbnailBase64 = async (cid: string): Promise<string> => {
  cid = cid.trim();

  if (!cid) {
    return "";
  }

  let mimeType;
  const index = cid.indexOf("|");
  if (index > 0) {
    // note: this is not index >= 0
    mimeType = cid.substring(0, index);
    cid = cid.substring(index + 1);
  } else {
    mimeType = "image/png";
  }

  let thumbnailBase64;
  try {
    const thumbnailBuffer: Buffer = await getIPFSData(cid);
    thumbnailBase64 = `data:${mimeType};base64,${thumbnailBuffer.toString(
      "base64",
    )}`;
  } catch (error) {
    console.log("getThumbnailBase64 error:", error);
    thumbnailBase64 = "";
  }

  return thumbnailBase64;
};
