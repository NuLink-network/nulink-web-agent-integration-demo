import "../assets/index.less";
import { Row, Form, Table } from "antd";
import { useNavigate } from "react-router-dom";
import { defaultImage, defaultAvatarImage } from "@/utils/defaultImage";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { locale } from "@/config";
import { type FileListRequestOptions } from "../api/find";
import { getThumbnailBase64 } from "@/utils/image";
import {
  getAvatarBase64String,
  getUserCache,
} from "@/features/auth/api/getLoginedUserInfo";
import OvalButton from "@/components/Button/OvalButton";
import { Pagination } from "@mui/material";
import { upload, getFileList } from "@nulink_network/nulink-web-agent-access-sdk";

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
    console.log(result.list,'辅导费', result.list.length);
    
    setResultList([]);
    if (result.list.length > 0) {
      result.list.forEach(async (item) => {
        if (!!item.owner_avatar) {
          const avatarStr = await getAvatarBase64String(item.owner_avatar);
          if (!!avatarStr) {
            item.owner_avatar = avatarStr;
          }
        }

        if (!!item.thumbnail) {
          item.src = await getThumbnailBase64(item.thumbnail);
          item.useThumbnailBase64 = true;
        } else {
          item.src = locale.messages.suffixs[item.suffix]
            ? require(`../../../assets/img/${
                locale.messages.suffixs[item.suffix]
              }.png`)
            : null;
        }
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

  const _uploadAction = async () => {
    await upload(async (data) => {
      window.location.reload()
    });
  };

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
        <OvalButton
          title={t<string>("header-a-tab-2")}
          onClick={_uploadAction}
        />
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
