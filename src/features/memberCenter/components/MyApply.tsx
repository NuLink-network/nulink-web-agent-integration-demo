import { Select, Table, Tooltip, Modal } from "antd";
import { Pagination } from "@mui/material";
import { t } from "i18next";
import "../assets/myApply.less";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useState, useEffect } from "react";
import { toDisplayAddress } from "@/utils/format";
import { locale } from "@/config";
import OvalButton from "@/components/Button/OvalButton";
import storage from "@/utils/storage";
import { cache_user_key } from "@/features/auth/api/getLoginedUserInfo";
import { decrypt } from "@/utils/crypto";
import { getData } from "@/utils/ipfs";
import { download as fileDownload, getSendApplyFiles } from "@nulink_network/nulink-web-agent-access-sdk";
dayjs.extend(utc);

const { Option } = Select;
const selectStyle = {
  width: "130px",
};
export const MyApply = () => {
  const pageSize = 10;
  const [pageIndex, setPageIndex] = useState(1);
  const [applyList, setApplyList] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState(0);
  const [currentRecord, setCurrentRecord] = useState<any>({});
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const seeNote = async (record) => {
    setIsNoteModalVisible(true);
    setCurrentRecord(record);
  };
  useEffect(() => {
    (async () => {
      await statusSelectHandler(0);
    })();
  }, []);
  const columns = [
    {
      title: `${t<string>("member-center-apply-table-title-2")}`,
      dataIndex: "file_name",
      width: 200,
      key: "file_name",
    },
    {
      title: `${t<string>("member-center-apply-table-title-3")}`,
      dataIndex: "days",
      key: "days",
      align: "center" as "center",
      render: (_, record) => (status <= 1 ? record.days : "~"),
    },
    {
      title: `${t<string>("member-center-apply-table-title-5")}`,
      dataIndex: "policy_id",
      key: "policy_id",
      render: (_, record) => record.policy_id || "~",
    },
    {
      title: `${t<string>("member-center-apply-table-title-4")}`,
      dataIndex: "status",
      key: "status",
      render: (_, record) => locale.messages.fileApplyStatus[record.status],
    },
    {
      dataIndex: "oprate",
      key: "oprate",
      render: (txt, record, index) => {
        if (record.status === 2) {
          return (
            <div style={{ textAlign: "center" }}>
              <OvalButton
                onClick={() => seeNote(record)}
                title={t<string>("member-center-approve-table-btn-1")}
              />
              <OvalButton
                onClick={() => download(record)}
                title={t<string>("member-center-apply-btn") as string}
              />
            </div>
          );
        } else {
          return (
            <div
              style={{
                color: "#ba9756",
                cursor: "pointer",
                textAlign: "center",
                fontWeight: 600,
              }}
              onClick={() => seeNote(record)}
            >
              {t<string>("member-center-approve-table-btn-1")}
            </div>
          );
        }
      },
    },
  ];

  const download = async (record) => {
    record.proposer_address = currentRecord.proposer_address;
    await fileDownload(record.file_id,record.file_name,record.file_owner_address, fileDownloadCallBack);
  };

  const fileDownloadCallBack = async (data) => {
    try {
      if (!!data && data.url) {
        const arraybuffer = await getData(decodeURIComponent(data.url))
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
    }catch (error){
      throw new Error("Decryption failed, Please try again")
    }
  }

  const authorizationSuccessHandler = async (e) => {
    const responseData = JSON.parse(e.data);
    const redirectUrl = responseData.redirectUrl;
    if (responseData && redirectUrl) {
      if (responseData.subAction && responseData.subAction == "relogin") {
        const userInfo = {
          accountAddress: responseData.accountAddress,
          accountId: responseData.accountId,
          publicKey: responseData.publicKey,
        };
        storage.setItem(cache_user_key, JSON.stringify(userInfo));
      }
      if (
        responseData.action == "decrypted" &&
        responseData.result == "success"
      ) {
        if (!!responseData && responseData.url) {
          const uuid = localStorage.getItem("uuid");
          const decryptUrl = decrypt(responseData.url, uuid).replaceAll(
            '"',
            "",
          );
          const arraybuffer = await getData(decryptUrl);
          const blob = new Blob([arraybuffer], { type: "arraybuffer" });
          let url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", responseData.fileName);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        window.removeEventListener("message", authorizationSuccessHandler);
      }
    }
  };

  const statusSelectHandler = async (value) => {
    const user = storage.getItem("userinfo");
    setStatus(value);
    setPageIndex(1);
    const result = (await getSendApplyFiles(user?.accountId, 0, 1, 10));
    setApplyList(result?.list || []);
    setTotal(result?.total || 0);
  };
  const pageChange = async (e, val) => {
    setPageIndex(val);
    const user = storage.getItem("userinfo");

    const result = (await getSendApplyFiles(user?.accountId, 0, val, 10));
    setApplyList(result?.list || []);
    setTotal(result?.total || 0);
  };
  return (
    <div className="my_apply">
      <div className="my_apply_select">
        <Select style={selectStyle} onChange={statusSelectHandler}>
          {locale.fields.fileApplyStatus.map((item) => {
            if (item.value === 0) return false;
            return (
              <Option key={item.label} value={item.value}>
                {item.label}
              </Option>
            );
          })}
        </Select>
      </div>
      <div className="my_apply_table">
        <Table
          columns={columns}
          dataSource={applyList}
          pagination={false}
          scroll={{ x: 1500 }}
        />
      </div>
      <div className="pagination">
        <Pagination
          count={total ? Math.ceil(total / pageSize) : 1}
          onChange={pageChange}
        />
      </div>
      <Modal
        title={t<string>("member-center-approve-table-btn-1")}
        width="640px"
        visible={isNoteModalVisible}
        centered
        footer={null}
        maskClosable={false}
        className="modal_class"
        onCancel={() => {
          setCurrentRecord({});
          setIsNoteModalVisible(false);
        }}
      >
        <div className="file-info">
          <div>
            <span>File name:</span>
            <span>{currentRecord?.file_name}</span>
          </div>
          <div>
            <span>Policy id:</span>
            <span>{currentRecord?.policy_id || "~"}</span>
          </div>
          <div>
            <span>{`${t("member-center-s-table-title-3")}:`}</span>
            <Tooltip title={currentRecord?.file_owner_address}>
              <span>{toDisplayAddress(currentRecord?.file_owner_address)}</span>
            </Tooltip>
          </div>
          <div>
            <span>{`${t("member-center-s-table-title-4")}:`}</span>
            <Tooltip title={currentRecord?.proposer_address}>
              <span>{toDisplayAddress(currentRecord?.proposer_address)}</span>
            </Tooltip>
          </div>
          {currentRecord?.status === 2 ? (
            <>
              <div>
                <span>Request time:</span>
                <span>
                  {dayjs(Number(currentRecord?.created_at) * 1000)
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss")}
                  (UTC)
                </span>
              </div>
              <div>
                <span>Expiration time:</span>
                <span>
                  {dayjs(Number(currentRecord?.end_at) * 1000)
                    .utc()
                    .format("YYYY-MM-DD HH:mm:ss")}
                  (UTC)
                </span>
              </div>
            </>
          ) : (
            <div>
              <span>Request Period:</span>
              <span>{currentRecord?.days || "~"}</span>
            </div>
          )}
          <div>
            <span>Status:</span>
            <span>
              {locale.messages.fileApplyStatus[currentRecord?.status]}
            </span>
          </div>
          <div>
            <span>Note:</span>
            <span>{currentRecord?.remark || "NULL"}</span>
          </div>
        </div>
        <div className="modal_btn">
          <OvalButton
            title={t<string>("member-center-approve-modal-btn-3")}
            onClick={() => setIsNoteModalVisible(false)}
          />
        </div>
      </Modal>
    </div>
  );
};
