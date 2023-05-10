import { useState, useRef } from "react";
import { Input, Form } from "antd";
import ChatWindow from "./chatWindow";
import { apiReqs } from  "@/api"
/* global chrome */
// TODO: 待抽离
function InputMessage({ value, onChange }) {
  const { TextArea } = Input;

  return (
    <div className="input-message">
      <div className="message-loading">
        <div className="message-loading-spin">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 3C16.9706 3 21 7.02944 21 12H19C19 8.13401 15.866 5 12 5V3Z"></path></svg>
        </div>
        <span>加载中，请稍候...</span>
      </div>
      <Form layout="vertical">
        <Form.Item>
          <TextArea
            placeholder="输入条件，按回车键提交"
            value={value}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // 阻止默认行为
                onChange({value: "", status: "enter"});
              }
            }}
            onChange={(e) => {
              onChange({value: e.target.value, status: "input"});
            }}
            bordered={false}
            // autoSize={{ minRows: 3, maxRows: 3 }}
          />
        </Form.Item>
      </Form>
    </div>
  );
}

function Chat() {
  const [input, setInput] = useState("");
  const chatWindowRef = useRef();

  // 记忆化组件内的 onChange 方法，避免不必要的函数重建
  const handleChangeInput = (props) => {
    const {value, status} = props;
    if( status === "enter" & input !== "") {
      const message = {
        role: 'user',
        content: input
      }
      chatWindowRef.current.addMessage(message)
      // TODO: 调用接口
      handlePostChat()
    }
    setInput(value);
  };

  const handlePostChat = async () => {
    let apiKey =  window.localStorage.getItem('apiKey');
    const currentMessages = chatWindowRef.current.getMessages();
    console.log('看看当前的currentMessages', currentMessages)
    return apiReqs.postChat({
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      data: {
        model: "gpt-3.5-turbo",
        messages: [...currentMessages],
        temperature: 0.7, // 0 ~ 1 越接近 1 越具有不确定性
        max_tokens: 2048, // 
      },
      success: (res) => {
        console.log('success',res.choices)
        // TODO: 特殊错误处理
        // if(res.error.type === 'server_error') {
        //   chatWindowRef.current.addMessage({
        //     role: 'system',
        //     content: '服务器错误，请稍后再试'
        //   })
        // }
        const message = res.choices[0].message;
        console.log('看一下请求结果', res.choices[0].message);
        chatWindowRef.current.addMessage(message);

      },
      fail: (res) => {
          console.log('fail',res)
      },
    })
  }

  return (
    <div className="chat">
      <ChatWindow ref={chatWindowRef}/>
      <InputMessage value={input} onChange={handleChangeInput} />
    </div>
  );
}

export default Chat;
