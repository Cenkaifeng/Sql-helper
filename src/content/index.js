/* global chrome */
import { useState } from "react";
import ReactDOM from "react-dom/client";
import MainModal from "./components/mainModal";
import "./content.styl";
// 从插件中拿资源，这样避免src中资源打成base64
// const iconUrl = chrome.runtime.getURL('/images/sql_helper_logo.png');

function Content() {
  const [mainModalVisible, setMainModalVisible] = useState(false);

  return (
    <div className="CRX-content">
      <div
        className="content-entry-box"
        // style={{backgroundImage: `url(${iconUrl})`}}
        onClick={() => {
          setMainModalVisible(true);
        }}
      >
        <div className="content-warp">
          <div className="content-entry"></div>
          <div className="content-entry-text">
            点击打开
            <br />
            SQL-Helper
          </div>
          <div className="content-entry-space"></div>
        </div>
      </div>
      <MainModal visible={mainModalVisible} setVisible={setMainModalVisible} />
    </div>
  );
}

// 创建id为CRX-container的div
const app = document.createElement("div");
app.id = "CRX-container";
// 将刚创建的div插入body最后
document.body.appendChild(app);
// 将ReactDOM插入刚创建的div
const crxContainer = ReactDOM.createRoot(
  document.getElementById("CRX-container")
);
crxContainer.render(<Content />);

// 向目标页面驻入js
try {
  let insertScript = document.createElement("script");
  insertScript.setAttribute("type", "text/javascript");
  insertScript.src = window.chrome.runtime.getURL("insert.js");
  document.body.appendChild(insertScript);
} catch (err) {}
