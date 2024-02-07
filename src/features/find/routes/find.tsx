import "../assets/index.less";
import {Row, Form, Table, Button} from "antd";
import { useNavigate } from "react-router-dom";
import { defaultImage, defaultAvatarImage } from "@/utils/defaultImage";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { locale } from "@/config";
import { type FileListRequestOptions } from "../api/find";
import {checkImgType, generateBlurThumbnail, getThumbnailBase64, setIPFSBlurThumbnail} from "@/utils/image";
import {
  getAvatarBase64String,
  getUserCache,
} from "@/features/auth/api/getLoginedUserInfo";
import OvalButton from "@/components/Button/OvalButton";
import { Pagination } from "@mui/material";
import { upload, getFileList, uploadFileBatch } from "@nulink_network/nulink-web-agent-access-sdk";
import storage from "@/utils/storage";
import axios from "axios";
import { DEMO_DAPP_BACKEND_URL } from "@/config";
import { setData as setIPFSData } from "@/utils/ipfs";
import { styled } from '@mui/material/styles';
import MuiButton from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const fileImgAreaStyle = {
  width: "75px",
  height: "fit-content",
  display: "inline-block",
};

export const ownedStyle = {
  border: "1px solid #ECECEC",
  borderRadius: "0px",
  padding: "2px 6px",
  color: "black",
  background: "ghostwhite",
};
export type uploadData = {
  dataLabel : string,
  fileBinaryArrayBuffer: Blob
}

export const Find = () => {
  const pageSize = 12;
  const [pageIndex, setPageIndex] = useState(1);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchValues, setSearchValues] = useState({});
  const [user, setUser] = useState<any>(null);
  const [resultList, setResultList] = useState<any>([]);
  const [total, setTotal] = useState(0);
  const [fileCategory, setFileCategory] = useState<any>([]);
  const [fileType, setFileType] = useState<any>(undefined);

  const [fileName] = useState<string>("");
  const [descOrder] = useState<boolean>(true);

  const [fileList, setFileList] = useState<Array<any>>([])


  const _onChangeAccountData = async (e) => {
    setFileList([...e.target.files])
    try {
      await uploadFileBatch([...e.target.files], uploadSuccessHandler.bind(this, [...e.target.files]))
    } catch (e){
      console.error(e)
    }
  }

  const toFindDetail = (fileDetail, user) => {
    navigate("/findDetail", { state: { file: fileDetail, user: user } });
  };

  const search = async (values: FileListRequestOptions = {}) => {
    //get user info
    const user = getUserCache();
    setUser(user);

    if (!user) {
      return;
    }
    console.log("user: ", user);

    if (Array.isArray(values.fileCategory)) {
      values.fileCategory = values.fileCategory[0];
    }

    setPageIndex(1);
    setSearchValues(values);
    let result = await getFileList(user.accountId, true, true, 1, pageSize);
    dealWithResultList(result);
  };

  const deduplication = (arr) => {
    const obj = {};
    return arr.reduce((prev, cur) => {
      if (!obj[cur.file_id]) {
        obj[cur.file_id] = true && prev.push(cur);
      }
      return prev;
    }, []);
  };

  const dealWithResultList = (result) => {

    setResultList([]);
    if (result.list.length > 0) {
      result.list.forEach(async (item) => {
        if (!!item.owner_avatar) {
          const avatarStr = await getAvatarBase64String(item.owner_avatar);
          if (!!avatarStr) {
            item.owner_avatar = avatarStr;
          }
        }

        if (checkImgType(item.file_name)){
          if (item.file_hash){
            const response = await axios.get(DEMO_DAPP_BACKEND_URL + '/fileThumbnail/findThumbnailByHash/' + item.file_hash)
            const cid = response.data.data
            if (!!cid){
              item.src = await getThumbnailBase64(cid);
              item.useThumbnailBase64 = true;
            } else {
              item.src = locale.messages.suffixs[item.suffix]
                  ? require(`../../../assets/img/${
                      locale.messages.suffixs[item.suffix]
                  }.png`)
                  : null;
            }
          } else {
            item.src = locale.messages.suffixs[item.suffix]
                ? require(`../../../assets/img/${
                    locale.messages.suffixs[item.suffix]
                }.png`)
                : null;
          }
        } else {
          item.src = locale.messages.suffixs[item.suffix]
              ? require(`../../../assets/img/${
                  locale.messages.suffixs[item.suffix]
              }.png`)
              : null;
        }

        /*if (!!item.thumbnail) {
          item.src = await getThumbnailBase64(item.thumbnail);
          item.useThumbnailBase64 = true;
        } else {

          item.src = locale.messages.suffixs[item.suffix]
              ? require(`../../../assets/img/${
                  locale.messages.suffixs[item.suffix]
              }.png`)
              : null;
        }*/
        setResultList((pre) => {
          pre.push(item);
          return deduplication(pre).sort((a, b) => b.created_at - a.created_at);
        });
      });
      setTotal(result.total);
    } else {
      setResultList([]);
      setTotal(0);
    }
  };

  const pageChange = async (e, val) => {
    setPageIndex(val);
    let result = await getFileList(user.accountId, true, true, val, pageSize);
    dealWithResultList(result);
  };

  useEffect(() => {
    (async () => {
      await search();
    })();
  }, [navigate]);

  const uploadSuccessHandler = async (_fileList,responseData) => {
    try {
      if(responseData.dataInfo){
        let map:Map<string,number> = new Map();
        responseData.dataInfo.map((data: { dataLabel: string; dataHash: number; }) => {
          map.set(data.dataLabel, data.dataHash)
        })
        let dataList:any = []
        const uploadData = await convertFileToUploadData(_fileList)
        for (const data of uploadData) {
          if (checkImgType(data.name)){
            const cid = await setIPFSBlurThumbnail(data.fileBinaryArrayBuffer, data.name)
            dataList.push({dataHash : map.get(data.name), cid: cid})
          }
        }
        /*for (let file of fileList) {
          const buffer = await generateBlurThumbnail(file, 180, 180, 6)
          const cid = await setIPFSData(buffer)
          dataList.push({dataHash : map.get(file.name), cid: cid})
        }*/
        await axios.post(DEMO_DAPP_BACKEND_URL + '/fileThumbnail/createBatch', dataList)
        await search()
      }
    } catch (e) {
      console.log(e)
    }
  }

  const arrayBufferToString = (arrayBuffer:ArrayBuffer) => {
    const decoder = new TextDecoder('utf-8');
    const uint8Array = new Uint8Array(arrayBuffer);
    const string = decoder.decode(uint8Array);
    return string;
  }

  const uploadArrayBuffer = async () => {
    try {
      await uploadFileBatch(fileList, uploadSuccessHandler)
    } catch (e){
      console.error(e)
    }
  };

  const convertFileToUploadData = async (files : File[]) => {
    const upFiles: any = []
    for (const file of files) {
      const fileBinaryArrayBuffer: ArrayBuffer = await blobToArrayBuffer(file) as ArrayBuffer
      upFiles.push({ name: file.name, fileBinaryArrayBuffer })
    }
    upFiles.forEach((x) => {
      x.fileBinaryArrayBuffer = Buffer.from(x.fileBinaryArrayBuffer).buffer
    })
    return upFiles
  }

  //* Convert resBlob to ArrayBuffer
  const blobToArrayBuffer = (blob: Blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = (e: any) => {
        const fileBinaryArrayBuffer = new Uint8Array(e?.target?.result).buffer;
        resolve(fileBinaryArrayBuffer);
      }
      reader.readAsArrayBuffer(blob);
    });
  }

  const _filterQuery = (key, value) => {
    const keyObj = {
      fileCategory: async () => {
        setFileCategory([value]);
        await search({
          fileName,
          fileCategory: value,
          fileType,
          descOrder,
          pageIndex,
          pageSize,
        });
      },
      fileType: async () => {
        const [data] = locale.fields.fileType.filter(
            (x) => x.label.toLocaleLowerCase() === value.toLocaleLowerCase(),
        );
        setFileType(data.value);
        await search({
          fileName,
          fileCategory,
          fileType: String(data.value),
          descOrder,
          pageIndex,
          pageSize,
        });
      },
    };
    keyObj[key]();
  };

  return (
    <div className="find_page reactive">
      <div className="find_page_search">
        {/* <input
              multiple
              type="file"
              onChange={_onChangeAccountData}
          /> */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: 'var(--ui-color-neutral-black-900)'
          }}
        >
          <MuiButton
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
            style={{
              background: '#ba9756',
              borderRadius: 20
            }}
          >
            {/* {t<string>("header-a-tab-2")} */}
            Upload via Agent
            <VisuallyHiddenInput
              multiple
              type="file"
              onChange={_onChangeAccountData}
            />
          </MuiButton>
          <div style={{ marginLeft: 10 }}>
            {fileList.length > 1
              ? `${fileList.length} ${t<string>("header-a-tab-2-2")}`
              : fileList[0]?.name}
          </div>
        </div>

        {/* <OvalButton
          title={'Upload via Agent'}
          onClick={uploadArrayBuffer}
        /> */}
      </div>
      <div className="find_page_content">
        <Row>
          {resultList.length > 0 &&
            resultList.map((file: any) => (
              <div className="content_box" key={file.file_id}>
                {!file.useThumbnailBase64 ? (
                  <div
                    className="file_img_area"
                    onClick={() => toFindDetail(file, user)}
                  >
                    <img
                      style={fileImgAreaStyle}
                      src={file.src || defaultImage}
                      alt=""
                    />
                  </div>
                ) : (
                  <img
                    src={file.src}
                    alt=""
                    onClick={() => toFindDetail(file, user)}
                  />
                )}

                <div className="content_box_middle nowrap">
                  <p>{file.file_name}</p>
                  <div className="tag">
                    {file.category && (
                      <span
                        onClick={_filterQuery.bind(
                          this,
                          "fileCategory",
                          file.category,
                        )}
                      >
                        {file.category}
                      </span>
                    )}
                    {file.format && (
                      <span
                        onClick={_filterQuery.bind(
                          this,
                          "fileType",
                          file.format,
                        )}
                      >
                        {file.format}
                      </span>
                    )}
                  </div>
                </div>
                <div className="content_box_bottom">
                  <div className="content_box_bottom_left">
                    <img
                      src={file.owner_avatar || defaultAvatarImage}
                      alt="avatar"
                      width="256"
                    />
                    {file.owner}
                  </div>
                  <div className="content_box_bottom_right">
                    <span
                      className="ml_4 "
                      style={file.owned ? ownedStyle : {}}
                    >
                      {file.owned ? "owner" : ""}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </Row>
        {resultList.length === 0 && (
          <Table dataSource={resultList} pagination={false} />
        )}
      </div>
      <div className="pagination">
        <Pagination
          page={pageIndex}
          count={total ? Math.ceil(total / pageSize) : 1}
          onChange={pageChange}
        />
      </div>
    </div>
  );
};
