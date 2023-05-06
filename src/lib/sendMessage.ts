import { generateRandomString } from "@/utils/generateRandomString";
import storage from "@/utils/storage";
import { message as Message } from "antd";

export const MESSAGE_CONNECT_KEY = "connectedAgent";
export const MESSAGE_PAY_KEY = "pay_key";

export const getMessageKey = async (id: string) => {
  const messageKey = await storage.getItem(id);
  return messageKey;
};
export const setMessageKey = async (id: string) => {
  const messageKey = generateRandomString(6);
  await storage.setItem(id, messageKey);
  return messageKey;
};

export const removeMessageKey = async (id: string) => {
  await storage.removeItem(id);
};

type CallbackHandler = (...args: any[]) => any;
type Response = {
  type: string;
  data: any;
  error?: any;
  id?: string;
};

export const sendMessage = (
  caller = "",
  data: Record<string, any>,
  callbackHandler: CallbackHandler,
) => {
  const nulink = globalThis.nulink;
  nulink !== undefined &&
    nulink.sendMessage(
      {
        type: caller,
        data,
        // id: ''
      },
      function (response: Response) {
        console.log(`${caller} response`, response.type, response.data);
        if (typeof callbackHandler === "function") {
          callbackHandler(response);
        }
      },
    );
};
export const sendMessageSync = (caller = "", data: Record<string, any>) => {
  return new Promise((resolve, reject) => {
    const nulink = globalThis.nulink;
    if (!nulink) {
      resolve(null);
      //  Message.info("please install nulink agent first and You must have access to the wallet");
      return;
    }

    nulink !== undefined &&
      nulink.sendMessage(
        {
          type: caller,
          data,
          // id: ''
        },
        function (response: Response) {
          console.log(
            `${caller} synchronous response`,
            response.type,
            response.data,
            response?.error,
          );
          if (response?.error?.data) {
            const errorInfo = response?.error?.data;
            if (errorInfo?.code === 401) {
              //TODO: wake up agent login page or create wallet page
              // Message.destroy();
              // Message.warn("please login nulink-agent first 111111111");
            } else {
              // Message.destroy();
              Message.error(
                errorInfo?.msg ||
                  errorInfo ||
                  `${caller} synchronous response error reason unknown`
              );
            }
            resolve(null);
            return;
          }
          //
          if (response.data === "data") {
            //compatible with older versions of agent, that means the function doesn't exist
            Message.error(
              `${caller} is not exist, Please check whether the plug-in version is the latest version`,
            );
            resolve(null);
            return;
          }
          resolve(response.data);
        },
      );
  }) as any;
};
