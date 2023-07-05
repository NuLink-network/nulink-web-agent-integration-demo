import {
  Button,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Table,
  Tooltip,
  Carousel,
  InputNumber,
} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Pagination } from "@mui/material";
import { t } from "i18next";
import "../assets/myApply.less";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { AlertColor } from "@mui/material";
import { useState, useEffect } from "react";
import OvalButton from "@/components/Button/OvalButton";
import { getFilesByStatusForAllApplyAsPublisher } from "../api/account";
import { locale } from "@/config";
import { toDisplayAddress } from "@/utils/format";
import { type UseWalletPayRequestOptions } from "@/features/auth/api/useWalletPay";
import { UsePopup } from "@/components/Popup";
import Alert from "@/components/Layout/Alert";
import storage from "@/utils/storage";
import { cache_user_key } from "@/features/auth/api/getLoginedUserInfo";
import {
  approve,
  batchApprove,
  getIncomingApplyFiles,
} from "@nulink_network/nulink-web-agent-access-sdk";

dayjs.extend(utc);

const { TextArea } = Input;

type ModalFormOptions = {
  selector: 1 | 2;
  remark: string;
};
const { Option } = Select;
const selectStyle = {
  width: "130px",
};
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
export const MyApprove = () => {
  const [form] = Form.useForm();
  const [approvalList, setApprovalList]: any = useState([]);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const pageSize = 10;
  const [pageIndex, setPageIndex] = useState(1);
  const [status, setStatus] = useState(0);
  const [ursulaShares, setUrsulaShares] = useState(1);
  const [ursulaThreshold, setUrsulaThreshold] = useState(1);
  const [currentRecord, setCurrentRecord] = useState<any>({});
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  useEffect(() => {
    (async () => {
      // const params: FilesForNeedToApprovedRequestOptions = {};
      // const result = await getFilesForNeedToApprovedAsPublisher(params);
      // console.log("getFilesForNeedToApprovedAsPublisher", result)

      await statusSelectHandler(0);
    })();
  }, []);
  const columns = [
    {
      title: `${t<string>("member-center-approve-table-title-2")}`,
      dataIndex: "apply_id",
      // dataIndex: "file_name",
      key: "apply_id",
      // key: "file_name",
      width: 200,
      render: (_, record) => {
        return record.file_name;
      },
    },
    {
      title: `${t<string>("member-center-apply-table-title-5")}`,
      dataIndex: "policy_id",
      key: "policy_id",
      render: (_, record) => record.policy_id || "~",
    },
    {
      title: `${t<string>("member-center-apply-table-title-3")}`,
      dataIndex: "days",
      key: "days",
      align: "center" as "center",
      render: (_, record) => (status <= 1 ? record.days : "~"),
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
      render: (_, record) => {
        return (
          <>
            {record.status === 1 ? (
              <div style={{ textAlign: "center" }}>
                <OvalButton
                  title={t<string>("member-center-approve-table-btn")}
                  onClick={() => audit(record)}
                />
              </div>
            ) : (
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
            )}
          </>
        );
      },
    },
  ];
  const [carouselCurrent, setCarouselCurrent] = useState<number>(1);
  const [isAuditModalVisible, setIsAuditModalVisible] = useState(false);
  const [isAuditMoreModalVisible, setIsAuditMoreModalVisible] = useState(false);
  const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
  const [useWalletParams, setUseWalletParams] =
    useState<UseWalletPayRequestOptions>();
  const audit = (record) => {
    const { proposer_id, apply_id, days } = record;
    setCurrentRecord(record);
    setIsAuditModalVisible(true);

    setUseWalletParams({
      startSeconds: Number(dayjs().unix()),
      endSeconds: Number(dayjs().add(days, "days").unix()),
      userAccountId: proposer_id,
      applyId: apply_id,
      remark: "",
      ursulaShares: ursulaShares,
      ursulaThreshold: ursulaThreshold < 1 ? 1 : Math.floor(ursulaThreshold),
    });
  };
  const seeNote = async (record) => {
    setIsNoteModalVisible(true);
    setCurrentRecord(record);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const approveSubmit = async () => {
    const { applyId, userAccountId } =
      useWalletParams as UseWalletPayRequestOptions;
    await approve(
        applyId,
        currentRecord.proposer_address,
        userAccountId,
        currentRecord.days,
        async () => {
          alert("Approve Success!");
          window.location.reload();
        })
  }
  const batchApproveSubmit = async () => {
    const applyArray = selectedRows.map((x: any) => {
      return {applyId: x.apply_id, days: x.days, applyUserId: x.proposer_id }
    });
    await batchApprove(applyArray, async () => {
      alert("Approve Success!");
      window.location.reload();
    });
  };

  const approveSuccessHandler = async (e) => {
    const responseData = e.data;
    const redirectUrl = responseData.redirectUrl;
    if (responseData && redirectUrl) {
      if (responseData.action == "approve") {
        window.removeEventListener("message", approveSuccessHandler);
        alert("Approve Success!");
      }
      if (responseData.subAction && responseData.subAction == "relogin") {
        const userInfo = {
          accountAddress: responseData.accountAddress,
          accountId: responseData.accountId,
          publicKey: responseData.publicKey,
        };
        storage.setItem(cache_user_key, JSON.stringify(userInfo));
      }
    }
  };
  /**
   * select action
   */
  const statusSelectHandler = async (value) => {
    const user = storage.getItem("userinfo");
    setStatus(value);
    setPageIndex(1);
    const params: any = {
      file_owner_id: user?.accountId,
      status: 0,
      paginate: {
        page: 1,
        page_size: 10,
      },
    };

    // const approvalList = (await getIncomingApplyFiles(user?.accountId, 0, 1, 10))
    const approvalList = await getIncomingApplyFiles(user?.accountId, 0, 1, 10);

    setApprovalList(approvalList?.list || []);
    setTotal(approvalList?.total || 0);
  };

  const pageChange = async (e, val) => {
    setPageIndex(val);
    const user = storage.getItem("userinfo");
    const params: any = {
      file_owner_id: user?.accountId,
      status: 0,
      paginate: {
        page: 1,
        page_size: 10,
      },
    };
    const approvalList = await getIncomingApplyFiles(
      user?.accountId,
      0,
      val,
      10,
    );
    setApprovalList(approvalList?.list || []);
    setTotal(approvalList?.total || 0);
  };

  const sharesSelectHandler = async (value) => {
    setUrsulaShares(value);
  };

  const ursulaThresholdChange = async (value) => {
    setUrsulaThreshold(value);
  };

  const rowSelection = {
    columnTitle: " ",
    onChange: (_selectedRowKeys: React.Key[], _selectedRows) => {
      setSelectedRows(_selectedRows);
      setSelectedRowKeys(_selectedRowKeys);
    },
    getCheckboxProps: (record) => {
      return {
        disabled:
          record.status === 2
            ? true
            : selectedRowKeys.length >= 5
            ? selectedRowKeys.includes(record.apply_id) === false
            : false,
      };
    },
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

        <OvalButton
          title={"Batch review"}
          onClick={() => setIsAuditMoreModalVisible(true)}
          disabled={selectedRowKeys.length < 2}
        />
      </div>
      <div className="my_apply_table">
        <Table
          columns={columns}
          dataSource={approvalList}
          pagination={false}
          rowKey={(record) => record.apply_id}
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
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
        title={"Details"}
        width="640px"
        destroyOnClose
        visible={isAuditModalVisible}
        centered
        footer={null}
        maskClosable={false}
        className="approve_modal"
        onCancel={() => {
          setIsAuditModalVisible(false);
        }}
      >
        <div className="file-info">
          <div>
            <span>File name:</span>
            <span>{currentRecord?.file_name}</span>
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
          <div>
            <span>Policy id:</span>
            <span>{currentRecord?.policy_id || "~"}</span>
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
        </div>
        <div className="review-request-title">Review request</div>
        <Form
          preserve={false}
          form={form}
          labelAlign="left"
          labelCol={{ span: 4, offset: 0 }}
          wrapperCol={{ span: 18 }}
          onFinish={async (values: ModalFormOptions) => {
            await approveSubmit();
          }}
        >
          <Form.Item
            className="label-half"
            label={t<string>("member-center-approve-modal-label-1")}
            name="selector"
            initialValue={1}
          >
            <Radio.Group>
              {locale.fields.approveSelector.map((option) => (
                <Radio value={option.value}>{option.label}</Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item
            className="label-half"
            label={"Number of Proxies"}
            name="shares"
          >
            <Select
              style={selectStyle}
              onChange={sharesSelectHandler}
              defaultValue={ursulaShares}
            >
              {locale.fields.preOfShares.map((item) => (
                <Option key={item.label} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* <Form.Item
            className="label-half"
            label={"Pre of threshold"}
            name="ursulaThreshold"
            initialValue={
              ursulaShares * 0.4 >= 1 ? Math.floor(ursulaShares * 0.4) : 1
            }
          >
            <InputNumber
              min={1}
              step={1}
              style={selectStyle}
              max={
                Math.floor(ursulaShares * 0.5) < 1
                  ? 1
                  : Math.floor(ursulaShares * 0.5)
              }
              onChange={ursulaThresholdChange}
            />
          </Form.Item> */}

          <Form.Item
            label={t<string>("member-center-approve-modal-label-2")}
            name="remark"
          >
            <TextArea />
            {/* <Input type="textarea"></Input> */}
          </Form.Item>
          <div className="modal_btn">
            <Button
              style={btnStyle}
              onClick={() => {
                setIsAuditModalVisible(false);
              }}
            >
              {t<string>("member-center-approve-modal-btn-1")}
            </Button>
            <Button
              style={Object.assign({}, btnStyle, btnStyleOk)}
              htmlType="submit"
            >
              {t<string>("member-center-approve-modal-btn-2")}
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal
        title={"More Details"}
        width="640px"
        destroyOnClose
        visible={isAuditMoreModalVisible}
        centered
        footer={null}
        maskClosable={false}
        className="approve_modal"
        onCancel={() => {
          setIsAuditMoreModalVisible(false);
        }}
      >
        <Carousel
          dots={false}
          arrows
          className="carousel"
          prevArrow={<LeftOutlined />}
          nextArrow={<RightOutlined />}
          afterChange={(current: number) => {
            setCarouselCurrent(current + 1);
          }}
        >
          {selectedRows.length > 0 &&
            selectedRows.map((x: any) => (
              <div className="file-info">
                <div>
                  <span>File name:</span>
                  <span>{x?.file_name}</span>
                </div>
                <div>
                  <span>{`${t("member-center-s-table-title-3")}:`}</span>
                  <Tooltip title={x?.file_owner_address}>
                    <span>{toDisplayAddress(x?.file_owner_address)}</span>
                  </Tooltip>
                </div>
                <div>
                  <span>{`${t("member-center-s-table-title-4")}:`}</span>
                  <Tooltip title={x?.proposer_address}>
                    <span>{toDisplayAddress(x?.proposer_address)}</span>
                  </Tooltip>
                </div>
                <div>
                  <span>Policy id:</span>
                  <span>{x?.policy_id || "~"}</span>
                </div>
                {x?.status === 2 ? (
                  <>
                    <div>
                      <span>Request time:</span>
                      <span>
                        {dayjs(Number(x?.created_at) * 1000)
                          .utc()
                          .format("YYYY-MM-DD HH:mm:ss")}
                        (UTC)
                      </span>
                    </div>
                    <div>
                      <span>Expiration time:</span>
                      <span>
                        {dayjs(Number(x?.end_at) * 1000)
                          .utc()
                          .format("YYYY-MM-DD HH:mm:ss")}
                        (UTC)
                      </span>
                    </div>
                  </>
                ) : (
                  <div>
                    <span>Request Period:</span>
                    <span>{x?.days || "~"}</span>
                  </div>
                )}
                <div>
                  <span>Status:</span>
                  <span>{locale.messages.fileApplyStatus[x?.status]}</span>
                </div>
              </div>
            ))}
        </Carousel>
        {carouselCurrent}/{selectedRows.length}
        <div className="review-request-title">Review request</div>
        <Form
          preserve={false}
          form={form}
          labelAlign="left"
          labelCol={{ span: 4, offset: 0 }}
          wrapperCol={{ span: 18 }}
          onFinish={async (values: ModalFormOptions) => {
            await batchApproveSubmit();
          }}
        >
          <Form.Item
            className="label-half"
            label={t<string>("member-center-approve-modal-label-1")}
            name="selector"
            initialValue={1}
          >
            <Radio.Group>
              {locale.fields.approveSelector.map((option) => (
                <Radio value={option.value}>{option.label}</Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item
            className="label-half"
            label={"Number of Proxies"}
            name="shares"
          >
            <Select
              style={selectStyle}
              onChange={sharesSelectHandler}
              defaultValue={ursulaShares}
            >
              {locale.fields.preOfShares.map((item) => (
                <Option key={item.label} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* <Form.Item
            className="label-half"
            label={"Pre of threshold"}
            name="ursulaThreshold"
            initialValue={
              ursulaShares * 0.4 >= 1 ? Math.floor(ursulaShares * 0.4) : 1
            }
          >
            <InputNumber
              min={1}
              step={1}
              style={selectStyle}
              max={
                Math.floor(ursulaShares * 0.5) < 1
                  ? 1
                  : Math.floor(ursulaShares * 0.5)
              }
              onChange={ursulaThresholdChange}
            />
          </Form.Item> */}

          <Form.Item
            label={t<string>("member-center-approve-modal-label-2")}
            name="remark"
          >
            <TextArea />
            {/* <Input type="textarea"></Input> */}
          </Form.Item>
          <div className="modal_btn">
            <Button
              style={btnStyle}
              onClick={() => {
                setIsAuditModalVisible(false);
              }}
            >
              {t<string>("member-center-approve-modal-btn-1")}
            </Button>
            <Button
              style={Object.assign({}, btnStyle, btnStyleOk)}
              htmlType="submit"
            >
              {t<string>("member-center-approve-modal-btn-2")}
            </Button>
          </div>
        </Form>
      </Modal>
      <Modal
        title={t<string>("member-center-approve-table-btn-1")}
        width="640px"
        visible={isNoteModalVisible}
        centered
        footer={null}
        maskClosable={false}
        className="modal_class"
        onCancel={() => {
          setIsNoteModalVisible(false);
        }}
      >
        <div className="file-info">
          <div>
            <span>File name:</span>
            <span>{currentRecord?.file_name}</span>
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
          <div>
            <span>Policy id:</span>
            <span>{currentRecord?.policy_id || "~"}</span>
          </div>
          {currentRecord.status === 2 ? (
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
      <UsePopup
        visible={visible}
        onChange={setVisible}
        content="Operate success!"
      />
      <Alert
        open={open}
        severity={severity}
        onClose={handleClose}
        message={alertMessage}
      />
    </div>
  );
};
