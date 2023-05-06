import SingletonService from "singleton-service";
import sleep from "await-sleep";
import { create, IPFSHTTPClient } from "ipfs-http-client";
import { AwaitIterable } from "ipfs-core-types";
import { isBlank } from "@/utils/null";
import storage from "@/utils/storage";
import { Buffer } from "buffer";
import { message as Message } from "antd";
import { decrypt as pwdDecrypt } from "@/utils/passwordEncryption";
import { isDevEnv } from "@/config";

const IPFS_CLIENT_INSTANCE_NAME_PREFIX = "ipfsClient";
const IPFS_NODE_PREFIX = "ipfsAddress";
const retryCount = 5;

export const setIPFSNodeUrl = async (ipfsAddress: string): Promise<void> => {
  ipfsAddress = ipfsAddress.endsWith("/")
    ? ipfsAddress.substring(0, ipfsAddress.length - 1)
    : ipfsAddress;
  //"/ip4/54.241.67.36/tcp/5001"
  await storage.setItem(IPFS_NODE_PREFIX, ipfsAddress);
};

export const getIPFSNodeUrl = async (): Promise<string> => {
  return await storage.getItem(IPFS_NODE_PREFIX);
};

export const getIPFSClient = async () => {
  // for get instance with saved key
  let client = SingletonService.get<IPFSHTTPClient>(
    IPFS_CLIENT_INSTANCE_NAME_PREFIX,
  );
  if (isBlank(client)) {
    /*
    modify url 
    http://54.241.67.36:5001/api/v0/cat?arg=QmWRC5zP1eCpxWf535iCQNquoCACePK1myCFsMcs9N57Xw =>
    http://54.241.67.36:5001/ipfs/api/v0/cat?arg=QmWRC5zP1eCpxWf535iCQNquoCACePK1myCFsMcs9N57Xw

    for nginx rewrite the http /ipfs request to https request

    */
    const ipfsUrl = await getIPFSNodeUrl();
    //for server
    if (isDevEnv) {
      const bInfura: boolean = ipfsUrl.indexOf("infura") >= 0;
      let options: any = { url: ipfsUrl };
      if (bInfura) {
        options = {
          ...options,
          headers: {
            authorization: pwdDecrypt(
              "encrypted:0c282750a6f5be15394d171980af6023:8cbdd88a89b74a11cfd8c2a88e0fd4fb045fa83e911058b23894b2f87f2407d45326299618a30682762f5a82ca995f70d0d1cd558d51ac88b7a92656ab6e0d7c2bfef02040df1c23e76b64136d4dc236c6f01e9733e94a293e504cdff027d632c5f60f1befb22b2c75beab3738024e345c9e72f6d589fa7de775d36e0d99e0cdy9Zxst06",
              false,
            ),
          },
        };
      }

      client = create(options); //create("/ip4/54.241.67.36/tcp/5001");
    } else {
      let options: any = { url: ipfsUrl };
      try {
        client = create(options); //create("/ip4/54.241.67.36/tcp/5001");
        // client = create({
        //   url: ipfsUrl,
        //   // url: "https://ipfs.infura.io:5001",
        //   headers: {
        //     authorization: pwdDecrypt(
        //       "encrypted:0c282750a6f5be15394d171980af6023:8cbdd88a89b74a11cfd8c2a88e0fd4fb045fa83e911058b23894b2f87f2407d45326299618a30682762f5a82ca995f70d0d1cd558d51ac88b7a92656ab6e0d7c2bfef02040df1c23e76b64136d4dc236c6f01e9733e94a293e504cdff027d632c5f60f1befb22b2c75beab3738024e345c9e72f6d589fa7de775d36e0d99e0cdy9Zxst06",
        //       false,
        //     ),
        //   },
        // });
      } catch (error: any) {
        client = create({
          host: "filetransfer.nulink.org",
          port: 443,
          apiPath: "ipfs/api/v0",
          protocol: "https",
          headers: {
            authorization: pwdDecrypt(
              "encrypted:0c282750a6f5be15394d171980af6023:8cbdd88a89b74a11cfd8c2a88e0fd4fb045fa83e911058b23894b2f87f2407d45326299618a30682762f5a82ca995f70d0d1cd558d51ac88b7a92656ab6e0d7c2bfef02040df1c23e76b64136d4dc236c6f01e9733e94a293e504cdff027d632c5f60f1befb22b2c75beab3738024e345c9e72f6d589fa7de775d36e0d99e0cdy9Zxst06",
              false,
            ),
          },
        });
      }
    }

    // client = create({ url: await getIPFSNodeUrl() }); //create("/ip4/54.241.67.36/tcp/5001");
    SingletonService.set<IPFSHTTPClient>(
      IPFS_CLIENT_INSTANCE_NAME_PREFIX,
      client,
      true,
    );
  }

  return client;
};

export const setData = async (
  userData:
    | string
    | InstanceType<typeof String>
    | ArrayBufferView
    | ArrayBuffer
    | Blob
    | AwaitIterable<Uint8Array>
    | ReadableStream<Uint8Array>,
): Promise<string> => {
  let i = 0;
  do {
    try {
      const client = await getIPFSClient();

      /*
      call client.add return object:
      {
      path: 'ipfs-logo.svg',
      cid: CID('QmTqZhR6f7jzdhLgPArDPnsbZpvvgxzCZycXK7ywkLxSyU'),
      size: 3243
      }
    */
      // console.log("ipfs client", client);
      // call Core API methods
      const { cid } = await client.add(userData); //await client.add("Hello world!");
      // console.log("ipfs setData cid", cid.toString());
      return cid.toString();
    } catch (error) {
      i++;
      console.log("ipfs http setData retrying ....");
      if (i >= retryCount) {
        console.error("ipfs http setData error: ", error);
        Message.error("ipfs http setData error: " + error);
        throw error;
      }
      await sleep(1000);
    }
  } while (i < retryCount);

  throw new Error("ipfs setData failed, please check the network");
};

export const getData = async (cid: string): Promise<Buffer> => {
  let i = 0;
  do {
    try {
      const client = await getIPFSClient();
      // console.log("ipfs getData cid", cid);
      const stream = client.cat(cid);
      const chunks: Uint8Array[] = [];
      for await (const chunk of stream) {
        // chunks of data are returned as a Buffer, convert it back to a string
        chunks.push(chunk);
      }

      // console.log("ipfs getData cid string", Buffer.concat(chunks).toString());
      console.log("ipfs getData cid string cid: ", cid);
      return Buffer.concat(chunks);
    } catch (error) {
      i++;
      console.log(
        "ipfs http getData retrying .... cid: " + cid + " count: ",
        i,
      );
      if (i >= retryCount) {
        console.error("ipfs http getData error: ", error);
        Message.error("ipfs http getData error: " + error);
        throw error;
      }
      await sleep(1000);
    }
  } while (i < retryCount);

  throw new Error("ipfs setData failed, please check the network");
};
