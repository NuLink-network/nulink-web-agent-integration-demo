import { useEffect, useState } from "react";
import "../assets/index.less";
import '../assets/myUpload.less'
import dayjs from "dayjs";
import "@/features/find/components/styles/dataIndicators.less";
import { Row, Table } from "antd";
import { useTranslation } from "react-i18next";
import imgUrl from "@/assets/img/avatar.png";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUserInfo,
  // getUserFileTotal,
  // getUserShareTotal,
} from "../api/account";
import { Pagination, Tooltip } from "@mui/material";
import { locale } from "@/config";
import { getThumbnailBase64 } from "@/utils/image";
import { getFileListByCreator } from "../../find/api/find";
import { getAvatarBase64String } from "@/features/auth/api/getLoginedUserInfo";
import { defaultImage, defaultImageHandler } from "@/utils/defaultImage";
import rank1 from "@/assets/img/medal/rank1.png";
import rank2 from "@/assets/img/medal/rank2.png";
import rank3 from "@/assets/img/medal/rank3.png";
import rank4 from "@/assets/img/medal/rank4.png";
import rank5 from "@/assets/img/medal/rank5.png";
import rank6 from "@/assets/img/medal/rank6.png";
import rank7 from "@/assets/img/medal/rank7.png";
import rank8 from "@/assets/img/medal/rank8.png";
import rank9 from "@/assets/img/medal/rank9.png";
import rank10 from "@/assets/img/medal/rank10.png";

const darkColor = "#98989A";
const rankIcon = {
  1: rank1,
  2: rank2,
  3: rank3,
  4: rank4,
  5: rank5,
  6: rank6,
  7: rank7,
  8: rank8,
  9: rank9,
  10: rank10,
};

export const Creator = () => {
  const [total, setTotal] = useState(0);
  const [resultList, setResultList] = useState<any>([]);
  const [avatar, setAvatar] = useState(imgUrl);
  const [pageIndex, setPageIndex] = useState(1);
  const [userDetailInfo, setUserDetails] = useState<any>({});
  const [dataFileTotal, setDataFileTotal] = useState({ list: [], total: 0 });
  const [dataShareTotal, setDataShareTotal] = useState({ list: [], total: 0 });
  const { t } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const pageSize = 10;

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

  // const _fetch = async () => {
  //   const p = {
  //     account_id: params.accountID,
  //     start_at: dayjs("2022.12.01 00:00:00").valueOf() / 1000,
  //     end_at: dayjs("2022.12.31 23:59:59").valueOf() / 1000,
  //   };
  //   const { data: dataFT } = await getUserFileTotal(p);
  //   const { data: dataST } = await getUserShareTotal(p);
  //   setDataFileTotal(dataFT);
  //   setDataShareTotal(dataST);
  // };

  const _getFileListByCreator = async (val) => {
    setPageIndex(val);
    const { data } = await getFileListByCreator({
      account_id: params.accountID,
      paginate: {
        page: val,
        page_size: pageSize,
      },
      signature: "",
    });
    dealWithResultList(data);
  };

  const pageChange = async (e, val) => {
    await _getFileListByCreator(val);
  };

  const _getUserInfo = async () => {
    const { data } = await getUserInfo({
      account_id: params.accountID,
    });
    const ary: any = [];
    JSON.parse(data.ranking).forEach((x) => {
      ary.push(JSON.parse(x));
    });
    data.ranking = ary;

    setUserDetails(data);
    _getFileListByCreator(1);

    if (!!data && !!data.avatar) {
      const avatarStr = await getAvatarBase64String(data.avatar);
      if (!!avatarStr) {
        setAvatar(avatarStr);
      }
    }
  };

  const _openLink = (type: string) => {
    if (userDetailInfo[type]) {
      let url = userDetailInfo[type];
      if (
        userDetailInfo[type].substr(0, 7).toLowerCase() == "http://" ||
        userDetailInfo[type].substr(0, 8).toLowerCase() == "https://"
      ) {
        url = url;
      } else {
        url = "http://" + url;
      }
      window.open(url);
    }
  };

  useEffect(() => {
    window.setTimeout(async () => {
      await _getUserInfo();
      // await _fetch();
    }, 0);
  }, []);

  return (
    <>
      <div className="member_center">
        <div className="member_center_top">
          <div className="member_center_left">
            <div className="left_avatar">
              <div
                className="left_avatar_item"
                style={{ background: `url(${avatar})` }}
              />
            </div>
            <div className="member_introduction">
              <div className="member_introduction_name">
                <span>{userDetailInfo?.name}</span>
                <ul className="ranking_area">
                  {userDetailInfo?.ranking &&
                    userDetailInfo?.ranking.length > 0 &&
                    userDetailInfo.ranking.map((x) => (
                      <li key={Math.random()}>
                        <Tooltip
                          title={`Week${x.period} Ranking No.${x.ranking}`}
                        >
                          <div className="se">
                            {rankIcon[x.ranking] ? (
                              <img src={rankIcon[x.ranking]} alt="" />
                            ) : (
                              <span>{x.ranking}</span>
                            )}
                          </div>
                        </Tooltip>
                      </li>
                    ))}
                </ul>
              </div>
              <div>{userDetailInfo?.ethereum_addr}</div>
              <div className="member_social">
                <span>Find me on</span>
                <ul>
                  <li
                    onClick={_openLink.bind(this, "facebook")}
                    className={userDetailInfo.facebook ? "pointer" : ""}
                  >
                    <svg
                      width="25"
                      height="24"
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.50195 12.0016C2.50312 16.9209 6.08036 21.1096 10.939 21.8806V14.8916H8.40195V12.0016H10.942V9.80156C10.8284 8.7591 11.1845 7.72015 11.9136 6.96649C12.6427 6.21283 13.6693 5.82257 14.715 5.90156C15.4655 5.91368 16.2141 5.98052 16.955 6.10156V8.56056H15.691C15.2558 8.50356 14.8183 8.64728 14.5017 8.95122C14.1851 9.25517 14.0237 9.68644 14.063 10.1236V12.0016H16.834L16.391 14.8926H14.063V21.8806C19.3174 21.0502 23.002 16.2513 22.4475 10.9606C21.8929 5.66993 17.2932 1.73949 11.9808 2.01673C6.66831 2.29398 2.5028 6.68186 2.50195 12.0016Z"
                        fill={userDetailInfo.facebook ? "#503A86" : darkColor}
                      />
                    </svg>
                  </li>
                  <li
                    onClick={_openLink.bind(this, "twitter")}
                    className={userDetailInfo.twitter ? "pointer" : ""}
                  >
                    <svg
                      width="25"
                      height="24"
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.495 6.68799C21.3914 6.15208 22.0622 5.30823 22.382 4.31399C21.5397 4.81379 20.618 5.16587 19.657 5.35499C18.3246 3.94552 16.2135 3.60251 14.5034 4.51764C12.7933 5.43277 11.9075 7.37948 12.341 9.26999C8.89062 9.09676 5.67598 7.4669 3.49702 4.78599C2.35986 6.74741 2.94097 9.25477 4.82502 10.516C4.14373 10.4941 3.47754 10.3096 2.88202 9.97799C2.88202 9.99599 2.88202 10.014 2.88202 10.032C2.88241 12.0751 4.32239 13.8351 6.32502 14.24C5.69308 14.4119 5.03022 14.4372 4.38702 14.314C4.95022 16.0613 6.56057 17.2583 8.39602 17.294C6.87585 18.4871 4.99849 19.1342 3.06602 19.131C2.72349 19.1315 2.38123 19.1118 2.04102 19.072C4.00341 20.333 6.28738 21.0023 8.62002 21C11.8653 21.0223 14.984 19.7429 17.2787 17.448C19.5734 15.1531 20.8526 12.0342 20.83 8.78899C20.83 8.60299 20.8257 8.41799 20.817 8.23399C21.6575 7.62659 22.3828 6.87414 22.959 6.01199C22.176 6.35905 21.3455 6.58691 20.495 6.68799Z"
                        fill={userDetailInfo.twitter ? "#503A86" : darkColor}
                      />
                    </svg>
                  </li>
                  <li
                    onClick={_openLink.bind(this, "instagram")}
                    className={userDetailInfo.instagram ? "pointer" : ""}
                  >
                    <svg
                      width="25"
                      height="24"
                      viewBox="0 0 25 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.502 21.0409C10.042 21.0409 9.75195 21.0279 8.79195 20.9859C8.04332 20.9613 7.30439 20.8091 6.60695 20.5359C5.40026 20.0663 4.44609 19.1117 3.97695 17.9049C3.71426 17.2049 3.57257 16.4654 3.55795 15.7179C3.50195 14.7599 3.50195 14.4459 3.50195 12.0049C3.50195 9.53788 3.51495 9.24988 3.55795 8.29488C3.57289 7.5484 3.71457 6.80989 3.97695 6.11088C4.44558 4.90241 5.4013 3.94706 6.60995 3.47888C7.3086 3.21509 8.0473 3.07303 8.79395 3.05888C9.74895 3.00488 10.063 3.00488 12.502 3.00488C14.982 3.00488 15.267 3.01788 16.212 3.05888C16.9605 3.07315 17.7012 3.21519 18.402 3.47888C19.6103 3.94759 20.5658 4.90276 21.035 6.11088C21.3021 6.82008 21.4445 7.57013 21.456 8.32788C21.512 9.28588 21.512 9.59888 21.512 12.0389C21.512 14.4789 21.498 14.7989 21.456 15.7459C21.4411 16.4941 21.299 17.2343 21.036 17.9349C20.5656 19.1426 19.61 20.0975 18.402 20.5669C17.7022 20.8291 16.9631 20.9707 16.216 20.9859C15.261 21.0409 14.948 21.0409 12.502 21.0409ZM12.468 4.58788C10.022 4.58788 9.76795 4.59988 8.81295 4.64288C8.24294 4.65043 7.67843 4.75562 7.14395 4.95388C6.35471 5.25589 5.73018 5.87787 5.42495 6.66588C5.22517 7.20618 5.11996 7.77686 5.11395 8.35288C5.06095 9.32188 5.06095 9.57588 5.06095 12.0049C5.06095 14.4049 5.06995 14.6959 5.11395 15.6589C5.12291 16.2291 5.22805 16.7937 5.42495 17.3289C5.73063 18.1164 6.35505 18.7379 7.14395 19.0399C7.67807 19.2395 8.2428 19.3447 8.81295 19.3509C9.78095 19.4069 10.036 19.4069 12.468 19.4069C14.921 19.4069 15.175 19.3949 16.122 19.3509C16.6924 19.3439 17.2573 19.2387 17.792 19.0399C18.5764 18.7353 19.1969 18.1152 19.502 17.3309C19.7014 16.7901 19.8065 16.2192 19.813 15.6429H19.824C19.867 14.6869 19.867 14.4319 19.867 11.9889C19.867 9.54588 19.856 9.28888 19.813 8.33388C19.804 7.76433 19.6988 7.20039 19.502 6.66588C19.1976 5.88046 18.577 5.25918 17.792 4.95388C17.2574 4.75462 16.6924 4.6494 16.122 4.64288C15.155 4.58788 14.902 4.58788 12.468 4.58788ZM12.502 16.6239C10.6319 16.6251 8.94537 15.4996 8.22882 13.7723C7.51226 12.0451 7.90686 10.0562 9.22858 8.73334C10.5503 7.41047 12.5388 7.01415 14.2667 7.72921C15.9946 8.44428 17.1215 10.1299 17.122 11.9999C17.1192 14.5509 15.053 16.6189 12.502 16.6239ZM12.502 8.99788C10.8451 8.99788 9.50195 10.341 9.50195 11.9979C9.50195 13.6547 10.8451 14.9979 12.502 14.9979C14.1588 14.9979 15.502 13.6547 15.502 11.9979C15.4981 10.3426 14.1572 9.00173 12.502 8.99788ZM17.302 8.28489C16.7074 8.28268 16.2269 7.79947 16.228 7.20489C16.2291 6.61031 16.7114 6.12889 17.306 6.12889C17.9005 6.12889 18.3828 6.6103 18.384 7.20488C18.3842 7.49174 18.2702 7.76691 18.0672 7.96956C17.8642 8.17222 17.5888 8.28568 17.302 8.28489Z"
                        fill={userDetailInfo.instagram ? "#503A86" : darkColor}
                      />
                    </svg>
                  </li>
                  <li
                    onClick={_openLink.bind(this, "user_site")}
                    className={userDetailInfo.user_site ? "pointer" : ""}
                  >
                    <svg
                      width="23"
                      height="23"
                      viewBox="0 0 23 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M11.5663 0.00490852L11.5663 0.00490828C11.5368 0.0024541 11.5074 0 11.4779 0C11.446 0 11.4166 0.00245426 11.3871 0.00490852C5.37662 0.0662651 0.522088 4.94779 0.5 10.9656V11.0049C0.5 17.0792 5.4257 22.0049 11.5 22.0049C17.5743 22.0049 22.5 17.0792 22.5 11.0049C22.5 4.9527 17.6111 0.0417224 11.5663 0.00490852ZM12.2535 7.86591C13.4389 7.81437 14.5875 7.62294 15.6845 7.31124C15.9447 8.2365 16.1066 9.20348 16.1631 10.1999H12.2535V7.86591ZM12.2535 1.60754V6.28782C13.2573 6.23873 14.234 6.07675 15.1667 5.8166C14.5163 4.24342 13.5714 2.8224 12.4032 1.61981C12.3786 1.61736 12.3535 1.61552 12.3283 1.61368L12.3283 1.61368L12.3283 1.61367L12.3283 1.61367L12.3283 1.61367L12.3283 1.61367L12.3283 1.61367L12.3283 1.61367L12.3282 1.61367L12.3282 1.61367L12.3282 1.61367L12.3282 1.61367L12.3282 1.61367L12.3282 1.61367L12.3282 1.61367C12.3031 1.61183 12.278 1.60999 12.2535 1.60754ZM10.7024 1.61245V6.278C9.72802 6.21419 8.78068 6.0473 7.87506 5.78715C8.54507 4.22133 9.50223 2.80767 10.6852 1.6149C10.6901 1.61245 10.6975 1.61245 10.7024 1.61245ZM10.7024 10.1999V7.85609C9.5415 7.78737 8.41745 7.58858 7.34003 7.26952C7.06515 8.20705 6.8909 9.18876 6.82954 10.1999H10.7024ZM5.25145 10.1999H2.10754C2.24989 8.52365 2.83155 6.9701 3.73472 5.65707C4.40718 6.07184 5.11401 6.43507 5.85274 6.74186C5.52387 7.84873 5.31772 9.00469 5.25145 10.1999ZM5.84784 15.295C5.5116 14.1635 5.30544 12.9781 5.24654 11.751H2.10263C2.23516 13.4592 2.82419 15.0397 3.74944 16.3699C4.417 15.9576 5.11647 15.5993 5.84784 15.295ZM6.82463 11.751H10.7024V14.1807C9.53905 14.247 8.41008 14.4482 7.33512 14.7673C7.05288 13.8028 6.87863 12.7916 6.82463 11.751ZM10.7024 20.3998V15.7613C9.72311 15.8251 8.77332 15.992 7.86278 16.257C8.52298 17.8057 9.46542 19.2071 10.6263 20.3925L10.7024 20.3998ZM12.2535 20.4023V15.749C13.2352 15.7981 14.1899 15.9527 15.1053 16.2006C14.4279 17.7811 13.456 19.2046 12.2535 20.4023ZM12.2535 11.751V14.1709C13.4241 14.2224 14.558 14.409 15.6428 14.7133C15.9201 13.766 16.0968 12.7744 16.1582 11.751H12.2535ZM17.7338 11.751H20.8974C20.7648 13.4297 20.1954 14.9833 19.2996 16.2987C18.6124 15.884 17.886 15.5207 17.1325 15.2189C17.4639 14.112 17.67 12.9511 17.7338 11.751ZM17.1767 6.7983C17.4909 7.88554 17.6823 9.02677 17.7387 10.1999V10.1975H20.8925C20.7526 8.55065 20.1881 7.02409 19.3119 5.72824C18.6345 6.14056 17.9203 6.49888 17.1767 6.7983ZM18.313 4.48884C17.7854 4.79808 17.2332 5.0705 16.6613 5.30611C16.2171 4.21151 15.6452 3.18318 14.9654 2.23583C16.2416 2.74141 17.3804 3.51696 18.313 4.48884ZM6.38532 5.25703C6.84181 4.16979 7.42347 3.14636 8.11067 2.20638C6.832 2.69969 5.68585 3.46296 4.74833 4.42749C5.27108 4.73918 5.81838 5.01651 6.38532 5.25703ZM4.76305 17.5995C5.27845 17.2927 5.81838 17.0203 6.3755 16.7847C6.82218 17.8523 7.38666 18.8585 8.05667 19.7863C6.80745 19.2929 5.68831 18.5419 4.76305 17.5995ZM16.6 16.7037C16.1336 17.8204 15.5348 18.8684 14.8231 19.828C16.1484 19.3298 17.3338 18.5395 18.2959 17.5357C17.7535 17.2191 17.1865 16.9418 16.6 16.7037Z"
                        fill={userDetailInfo.user_site ? "#503A86" : darkColor}
                      />
                    </svg>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="member_center_right">
            <div className="self_site">
              <p className="about-me">About me:</p>
              <div className="member_introduction_text">
                {userDetailInfo?.profile || t("member-center-introduce")}
              </div>
            </div>
          </div>
        </div>
        {/* <div className="member_center_dataIn">
          <p>Statistical Time: 2022.12.01 ~ 2022.12.31</p>
          <div className="data-indicators-area">
            <ul className="data-indicators">
              <li>
                <div className="title-logo">
                  <svg
                    width="24"
                    height="16"
                    viewBox="0 0 24 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M18.9999 16.0001H5.99992C2.87429 16.002 0.270809 13.604 0.0162787 10.4887C-0.238251 7.37347 1.94144 4.58465 5.02592 4.07911C6.44563 1.562 9.11003 0.00362534 11.9999 5.65992e-05C13.8019 -0.00675485 15.5524 0.601415 16.9619 1.72411C18.346 2.82197 19.33 4.34509 19.7619 6.05811C22.3458 6.45514 24.1877 8.77563 23.9879 11.3822C23.7882 13.9888 21.6141 16.0015 18.9999 16.0001ZM11.9999 2.0001C9.83163 2.00267 7.83259 3.17221 6.76792 5.06111L6.29992 5.90011L5.35091 6.05511C3.3012 6.39852 1.85592 8.25441 2.02513 10.3258C2.19433 12.3972 3.92164 13.9939 5.99992 14.0001H18.9999C20.5685 14.0017 21.8735 12.7947 21.9941 11.2308C22.1147 9.66685 21.0102 8.27401 19.4599 8.03511L18.1439 7.83511L17.8219 6.54311C17.1572 3.86992 14.7545 1.99507 11.9999 2.0001ZM13.4499 12.0001H10.5499V9.00011H7.99992L11.9999 5.00011L15.9999 9.00011H13.4499V12.0001Z"
                      fill="white"
                    />
                  </svg>
                  <span>Files Uploaded</span>
                </div>
                <span>{dataFileTotal.total}</span>
              </li>
              <li>
                <div className="title-logo">
                  <svg
                    width="16"
                    height="20"
                    viewBox="0 0 16 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 20H2C0.89543 20 0 19.1046 0 18V2C0 0.89543 0.89543 0 2 0H9C9.0109 0.000472319 9.02167 0.00249256 9.032 0.006C9.04177 0.00901724 9.05182 0.0110277 9.062 0.012C9.15019 0.0176532 9.23726 0.0347982 9.321 0.063L9.349 0.072C9.37167 0.079682 9.39373 0.0890412 9.415 0.1C9.52394 0.148424 9.62321 0.216185 9.708 0.3L15.708 6.3C15.7918 6.38479 15.8596 6.48406 15.908 6.593C15.918 6.615 15.925 6.638 15.933 6.661L15.942 6.687C15.9699 6.77039 15.9864 6.85718 15.991 6.945C15.9926 6.95418 15.9949 6.96322 15.998 6.972C15.9998 6.98122 16.0004 6.99062 16.0001 7V18C16.0001 19.1046 15.1046 20 14 20ZM2 2V18H14V8H9C8.44772 8 8 7.55228 8 7V2H2ZM10 3.414V6H12.586L10 3.414Z"
                      fill="white"
                    />
                  </svg>
                  <span>File Sharing Count</span>
                </div>
                <span>{dataShareTotal.total}</span>
              </li>
            </ul>
          </div>
        </div> */}
        <div className="member_center_content">
          <div className="my_upload_content">
            <Row>
              {resultList.map((file: any) => (
                <div
                  key={file.file_id}
                  className="content_box"
                  onClick={() =>
                    navigate("/findDetail", {
                      state: { file: file, hide: false, user: userDetailInfo },
                    })
                  }
                >
                  {!file.useThumbnailBase64 ? (
                    <div className="file_img_area">
                      <img
                        style={{
                          display: "inline-block",
                          width: "75px",
                          height: "fit-content",
                        }}
                        src={file.src || defaultImage}
                        onError={defaultImageHandler}
                        alt=""
                      />
                    </div>
                  ) : (
                    <img src={file.src} alt="" />
                  )}
                  <div className="content_box_middle" title={file.file_name}>
                    {file.file_name}
                  </div>
                  <div className="content_box_bottom">
                    <div className="content_box_bottom_left">
                      <img src={avatar} alt="" />
                      {file.owner}
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
      </div>
    </>
  );
};
