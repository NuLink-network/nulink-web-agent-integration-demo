import "@/assets/style/login.less";
import LoginIcon from "@/assets/img/login_icon.svg";
import OvalButton from "@/components/Button/OvalButton";
// import { useTranslation } from "react-i18next";

export const Login = ({ loginStatus }) => {
  return (
    <div className="login">
      {/* // 0: logining //1: login failed //2: login success: when user login succeed, the Login page is hidden */}
      {loginStatus === 0 ? (
        <span className="loading">Logining .... </span>
      ) : loginStatus === 1 ? (
        <div className="connect">
          <img src={LoginIcon} alt="" />
          <p className="tip">Click Agent button to connect nulink agent</p>
          {/* <p>Agent has not been installed yet?</p>
          <OvalButton
            title="Download agent"
            style={{ marginTop: "20px" }}
            onClick={() => {
              window.open(
                "https://download.nulink.org/release/agent/nulink-agent-1.0.zip",
              );
            }}
          /> */}
          <p>
            Please refer to{" "}
            <a
              className="help-center"
              href="https://docs.nulink.org/products/file_sharing_dapp"
              target="_blank"
            >
              Help Center
            </a>{" "}
            for agent instructions
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
