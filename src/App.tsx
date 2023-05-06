import "./App.css";
import "antd/dist/antd.min.css";
import "./assets/style/index.less";
import { Suspense, useEffect } from "react";
import { MainLayout } from "@/components/Layout";
import { message } from "antd";

function App() {
  message.config({
    maxCount: 1,
    rtl: true,
  });

  useEffect(() => {});

  const receiveMessage = (event) => {
    messageHandler(event);
  };
  const messageHandler = (event) => {
    const { type } = event.data;
    switch (type) {
      case "connectedAgent":
        break;
      case "MESSAGE_PAY_KEY":
        break;
      case "test_message_type":
        break;
      default:
        break;
    }
  };

  window.addEventListener("message", receiveMessage);

  return (
    <div className="App">
      <Suspense fallback={<div />}>
        <MainLayout> </MainLayout>
      </Suspense>
    </div>
  );
}

export default App;
