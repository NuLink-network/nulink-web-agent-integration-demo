import { getData as getIPFSData, setData as setIPFSData } from "./ipfs";
import Jimp from "jimp";
import {isBlank} from "@/utils/null";


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

export interface ThumbailResult {
  buffer: Buffer;
  mimeType: string;
}

const checkImgType = (fileName: string) => {
  if (!/\.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(fileName)) { //i: ignore case
    return false;
  } else {
    return true;
  }
};

export const setIPFSBlurThumbnail = async (
    imageArrayBuffer: ArrayBuffer | Buffer | string,
    fileName: string,
): Promise<string | undefined> => {
  try {
    const result = await getBlurThumbnail(
        imageArrayBuffer, fileName
    );
    if (!isBlank(result)) {
      const { buffer: thumbnailBuffer, mimeType }: ThumbailResult =
          result as ThumbailResult;
      return await setIPFSData(thumbnailBuffer.buffer);
    }
  } catch (error) {
    console.error(
        `generate or upload thumbail failed file name: ${fileName}`,
        error
    );
  }
}

export const getBlurThumbnail = async (
    imageArrayBuffer: ArrayBuffer | Buffer | string,
    fileName: string,
): Promise<ThumbailResult | null> => {
  //TODO:  Currently, only thumbnail images and Gaussian blur are supported.  Add other kinds of file to thumbnail later

  if (!checkImgType(fileName)) {
    console.log("unsupported convert to the thumbnail file name: ", fileName);
    return null;
  }
  //image: ArrayBuffer or image file path
  //return Buffer is thumbnail's buffer, string is image MiME type string, eg: 'image/png'

  let buf /* :Buffer | string */;
  if (imageArrayBuffer instanceof ArrayBuffer) {
    buf = Buffer.from(imageArrayBuffer, 0, imageArrayBuffer.byteLength) as Buffer;
  } else if (imageArrayBuffer instanceof Buffer) {
    buf = imageArrayBuffer as Buffer;
  } else {
    //string
    buf = imageArrayBuffer as string;
  }

  const image = await Jimp.read(buf);
  const rw = 256;
  const mimeType = image.getMIME();

  return new Promise<ThumbailResult>((resolve, reject) => {
    try {
      image
          .resize(rw, Jimp.AUTO /* Math.round((rw * h * 1.0) / w) */) // resize
          .blur(30)
          .getBuffer(image.getMIME() || Jimp.MIME_PNG, (err, buffer) => {
            if (!!err) {
              reject(err);
            } else {
              //console.log(buffer);
              resolve({ buffer: buffer, mimeType: mimeType });
            }
          });
    } catch (err) {
      reject(err);
    }
  });
};

