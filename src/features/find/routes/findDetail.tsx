import { Row, Col, Modal, Form, Button, Select } from "antd";
import {
  ClockCircleFilled,
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import "../assets/index.less";
import {
  defaultImageHandler,
  defaultImage,
  defaultAvatarImage,
} from "@/utils/defaultImage";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/format";
import OvalButton from "@/components/Button/OvalButton";
import {
  getFilesForApprovedAsUser,
  type FilesForApprovedAsUserRequestOptions,
} from "../api/apply";
import { UsePopup } from "@/components/Popup";
import type { FileApplyOptions } from "../types";
import {
  getAvatarBase64String,
  getUserCache,
} from "@/features/auth/api/getLoginedUserInfo";
import { apply, ApplyInfo } from "@nulink_network/nulink-web-agent-access-sdk";
import {
  download,
  getFileDetail,
} from "@nulink_network/nulink-web-agent-access-sdk";
import { getData } from "@/utils/ipfs";
import Alert from "@/components/Layout/Alert";
import { AlertColor } from "@mui/material";

const btnStyle = {
  width: "150px",
  height: "48px",
  background: "#7A7A7A",
  borderRadius: "100px",
  padding: "0",
  fontSize: "16px",
  fontWeight: "600",
  color: "#fff",
};
const btnStyleOk = {
  background: "#df9100",
  marginLeft: "20px",
};

export const FindDetail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [applyStatus, setApplyStatus] = useState<number | null>(null);
  const location = useLocation();
  const [detailItem, setDetailItem] = useState<Record<string, any>>({});
  const [approvedFileList, setApprovedFileList] = useState([]);
  const [buttonShow, setButtonShow] = useState(true);
  const [visible, setVisible] = useState(false); // result tips popup window
  const [bUploader, setIsUploader] = useState(false); // user.id === detailItem.creator_id id the uploader
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [alertMessage, setAlertMessage] = useState<string>("");

  const showMsg = (message: string, severity: AlertColor = "error") => {
    setOpen(true);
    setSeverity(severity);
    setAlertMessage(message);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /**
   * apply for file
   * @param values {usageDays: number}
   */
  const applyForFile = async (values) => {
    const applyInfo: ApplyInfo = {
      fileCreatorAddress: detailItem.creator_address,
      fileId: detailItem.file_id,
      fileName: detailItem.file_name,
      usageDays: values.usageDays,
    };
    await apply(applyInfo, async () => {
      window.location.reload();
    });
  };

  const _getFileDetail = async () => {
    const user = getUserCache();
    setUser(user);

    if (!user) {
      return;
    }

    // get state param by find.tsx page: navigate("/findDetail", { state: fileDetail });  // pass param between pages
    let passedFile: any = {};
    if (!location.state) {
      //
      navigate("/find", {});
    } else if ((location.state as any).file) {
      passedFile = (location.state as any).file;
      setButtonShow((location.state as any).hide);
    } else {
      passedFile = location.state as any;
    }

    (async (user) => {
      const result = await getFileDetail(passedFile.file_id, user.accountId);

      if (!!result.creator_avatar) {
        const avatarStr = await getAvatarBase64String(result.creator_avatar);
        if (!!avatarStr) {
          result.creator_avatar = avatarStr;
        } else {
          result.creator_avatar = defaultAvatarImage;
        }
      } else {
        result.creator_avatar = defaultAvatarImage;
      }

      setDetailItem(
        Object.assign({}, result, {
          owner: result.creator || passedFile.owner,
          src: passedFile.src,
        }),
      );

      const isUploader = result.creator_id === user.accountId;
      setIsUploader(isUploader);

      /**
       * Is not to apply for, if result.status === 0
       * Application status: 0: unapplied, 1: Applied, 2: approved, 3: rejected
       */
      setApplyStatus(result.status);

      if (result.status === 0 && !isUploader) {
        setButtonShow(true);
      }

      // get approved file list as account used
      const approveParams: FilesForApprovedAsUserRequestOptions = {};
      const approved = await getFilesForApprovedAsUser(approveParams);
      setApprovedFileList(approved.list);
    })(user);
  };

  useEffect(() => {
    _getFileDetail();
  }, [location]);

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const applyDownload = () => {
    setIsModalVisible(true);
  };
  const fileDownload = async () => {
    await download(
      detailItem.file_id,
      detailItem.file_name,
      detailItem.creator_address,
      fileDownloadCallBack,
    );
  };

  const fileDownloadCallBack = async (data) => {
    try {
      if (!!data && data.url) {
        const arraybuffer = await getData(decodeURIComponent(data.url));
        const blob = new Blob([arraybuffer], { type: "arraybuffer" });
        let url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", data.fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      throw new Error("Decryption failed, Please try again");
    }
  };

  const IconCom = () => {
    switch (applyStatus) {
      case 0:
        // not applied yet
        return null;
      case 1:
        // pending review
        return (
          <div className="find_detail_apply_status">
            <ClockCircleFilled
              name="dateTime"
              style={{ color: "#68BB8D", marginRight: "10px" }}
            />
            {t<string>("find-detail-a-status-1")}
          </div>
        );
      case 2:
        // application passed
        return (
          <div className="find_detail_apply_status">
            <CheckCircleFilled
              style={{ color: "#68BB8D", marginRight: "10px" }}
            />
            {t<string>("find-detail-a-status-2")}
          </div>
        );
      case 3:
        // application rejected
        return (
          <div className="find_detail_apply_status_error">
            <CloseCircleFilled
              style={{ color: "#FF3838", marginRight: "10px" }}
            />
            {t<string>("find-detail-a-status-3")}
          </div>
        );
      case 4:
        // application expired, out of date
        return (
          <div className="find_detail_apply_status_disabled">
            <ExclamationCircleFilled
              style={{ color: "#939CB0", marginRight: "10px" }}
            />
            {t<string>("find-detail-a-status-4")}
          </div>
        );
    }
  };
  const ButtonCom = () => {
    switch (applyStatus) {
      case 0:
      case 1:
        /**
         * not applied yet
         *  or
         * pending review
         */
        return null;
      case 2:
        // application passed
        return (
          <OvalButton
            title={t<string>("find-detail-a-btn-1")}
            onClick={() => fileDownload()}
          />
        );
      case 3:
      case 4:
        /**
         * application rejected
         *  or
         * application expired, out of date
         */
        return (
          <OvalButton
            title={t<string>("find-detail-a-btn-2")}
            // onClick={() => applyDownload()}
            onClick={() => {
              showMsg("Already applied, please wait for approval");
            }}
          />
        );
    }
  };

  const fileImgAreaStyle = {
    width: "75px",
    height: "fit-content",
    display: "inline-block",
  };

  return (
    <div className="find_detail marb-30">
      <Alert
        open={open}
        severity={severity}
        onClose={handleClose}
        message={alertMessage}
      />
      <Row className="find_detail_top">
        <Col span="12">
          <div className="find_detail_top_left">
            {!detailItem.thumbnail ? (
              <div className="file_img_area">
                <img
                  style={fileImgAreaStyle}
                  src={detailItem.src || defaultImage}
                  alt=""
                />
              </div>
            ) : (
              <img src={detailItem.src} alt="" onError={defaultImageHandler} />
            )}
          </div>
        </Col>
        <Col span="12">
          <div className="find_detail_top_right">
            <div className="find_detail_top_right_title flex_row">
              <div>{detailItem.file_name}</div>
            </div>
            <div className="find_detail_top_right_content">
              <div className="flex_row top_right_content_item mtb_30 pointer">
                <img
                  src={detailItem.creator_avatar || defaultAvatarImage}
                  alt=""
                />
                <div>
                  <div>{t<string>("find-detail-a-info-label-1")}</div>
                  <div>{detailItem.owner}</div>
                </div>
              </div>
              <div className="flex_row top_right_content_item">
                <div className="left_color">
                  {t<string>("find-detail-ipfs-file-address")}：
                </div>
                <div className="right_color">
                  {detailItem.file_ipfs_address}
                </div>
              </div>
              <div className="flex_row top_right_content_item">
                <div className="left_color">
                  {t<string>("find-detail-a-info-label-2")}：
                </div>
                <div className="right_color">
                  {formatDate(detailItem.file_created_at * 1000)}
                </div>
              </div>
            </div>
            {(applyStatus === null || !buttonShow) && (
              <div className="mart-30"></div>
            )}

            {bUploader && (
              <div className="find_detail_top_right_btn" onClick={fileDownload}>
                Self Download
              </div>
            )}
            {!bUploader && applyStatus === 0 && buttonShow && (
              <div
                className="find_detail_top_right_btn"
                onClick={applyDownload}
              >
                {t<string>("find-detail-a-btn")}
              </div>
            )}
            {!bUploader && [1, 2, 3, 4].includes(applyStatus as number) && (
              <div className="find_detail_apply_box">
                <div className="find_detail_apply_info">
                  <div className="find_detail_apply_info_left">
                    <div>
                      {t<string>("find-detail-a-info-label-4")}:{" "}
                      {formatDate(detailItem.apply_created_at * 1000)}
                    </div>
                    <div>
                      {t<string>("find-detail-a-info-label-5")}:{" "}
                      {detailItem?.apply_days || "~"}
                    </div>
                    {applyStatus === 2 && (
                      <>
                        <div>
                          {t<string>("find-detail-owning-strategy")}:{" "}
                          {detailItem.policy_id}
                        </div>
                        <div>
                          {t<string>("find-detail-strategy-owner")}:{" "}
                          {detailItem.creator_address}
                        </div>
                      </>
                    )}
                  </div>
                  {IconCom()}
                </div>
                {ButtonCom()}
              </div>
            )}
          </div>
        </Col>
      </Row>
      <Modal
        title={t<string>("find-detail-a-btn")}
        width="640px"
        destroyOnClose
        visible={isModalVisible}
        onCancel={handleCancel}
        centered
        footer={null}
        maskClosable={false}
        className="modal_class"
      >
        <Form
          preserve={false}
          form={form}
          initialValues={{
            usageDays: 1,
          }}
          onFinish={async (values: FileApplyOptions) => {
            if (detailItem.status == 4) {
              await fileDownload();
            } else {
              await applyForFile(values);
            }
          }}
        >
          <div className="flex_row mar_0">
            <Form.Item
              label={t<string>("find-detail-a-modal-lable")}
              name="usageDays"
            >
              <Select
                defaultValue="1"
                style={{ width: 120 }}
                options={[
                  {
                    value: "1",
                    label: "1",
                  },
                  {
                    value: "2",
                    label: "2",
                  },
                  {
                    value: "3",
                    label: "3",
                  },
                  {
                    value: "4",
                    label: "4",
                  },
                  {
                    value: "5",
                    label: "5",
                  },
                  {
                    value: "6",
                    label: "6",
                  },
                  {
                    value: "7",
                    label: "7",
                  },
                ]}
              />
            </Form.Item>
            <div className="ml_20">{t<string>("find-detail-a-modal-day")}</div>
          </div>

          <div className="modal_btn">
            <Button style={btnStyle} onClick={handleCancel}>
              {t<string>("find-detail-a-modal-btn-no")}
            </Button>
            <Button
              style={Object.assign({}, btnStyle, btnStyleOk)}
              htmlType="submit"
            >
              {t<string>("find-detail-a-modal-btn-ok")}
            </Button>
          </div>
        </Form>
      </Modal>
      <UsePopup
        visible={visible}
        onChange={setVisible}
        content="Operate success!"
      />
    </div>
  );
};
