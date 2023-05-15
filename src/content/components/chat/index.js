import { useState, useRef, useEffect } from "react";

import ChatWindow from "./chatWindow";
import ChatInputMessage from "./chatInputMessage";
import { apiReqs } from  "@/api"



function Chat(props) {
  const { promptData } = props;
  const [input, setInput] = useState("");
  const chatWindowRef = useRef();
  const [isLoading, setIsLoading] = useState(false);

  // 记忆化组件内的 onChange 方法，避免不必要的函数重建
  const handleChangeInput = (props) => {
    const {value, status} = props;
    if( status === "enter" & input !== "") {
      const message = {
        role: 'user',
        content: input
      }
      chatWindowRef.current.addMessage(message)
      handlePostChat()
    }
    setInput(value);
  };
  useEffect(() => {
      if(promptData.role && promptData.role !== 'system') {
        console.log('有新的配置，需要重新请求');
        chatWindowRef.current.initMessages(promptData);
        setIsLoading(true);
        setTimeout(() => {
          handlePostChat('init')
        }, 1000);
      }

  },[promptData])

  const handlePostChat = (user) => {
    let apiKey =  window.localStorage.getItem('apiKey');
    const currentMessages = chatWindowRef.current.getMessages();
    // console.log('chat !!!! 查看当前聊天数据列表 ',user, currentMessages)
    setIsLoading(true);
    console.log('apiReqs.postChat(',user, currentMessages, apiKey);

    return apiReqs.postChat({
      headers: {
        Authorization: `Bearer ${apiKey}`
      },
      data: {
        model: "gpt-3.5-turbo",
        // model: "gpt-3.5-turbo-0301",
        messages: [...currentMessages],
        temperature: 0.7, // 0 ~ 1 越接近 1 越具有不确定性
        max_tokens: 2048, // 
      },
      success: (res) => {
        console.log('success',res)
        // TODO: 特殊错误处理
        // if(res.error.type === 'server_error') {
        //   chatWindowRef.current.addMessage({
        //     role: 'system',
        //     content: '服务器错误，请稍后再试'
        //   })
        // }
        if(res.choices && res.choices[0].finish_reason !== "stop") {
          const message = res.choices[0].message;
          console.log('看一下 finish_reason incomplete 请求结果', res.choices[0].message);
          chatWindowRef.current.addMessage(message);
          handlePostChat()
        } else if(res.choices && res.choices[0].finish_reason === "stop"){
          // finish_reason === "stop" 时，表示对话结束
          const message = res.choices[0].message;
          console.log('看一下请求结果', res.choices[0].message);
          chatWindowRef.current.addMessage(message);
          setIsLoading(false);
        }
        if(res.error ){
          chatWindowRef.current.addMessage({
            role: 'system',
            content: res.error.message
          })
          setIsLoading(false);
        }
      },
      fail: (res) => {
        console.log('查看错误消息',res)
        setIsLoading(false);
      },
    })
  }

  return (
    <div className="P-chat">
      <ChatWindow ref={chatWindowRef}/>
      <ChatInputMessage loading={isLoading} value={input} onChange={handleChangeInput} />
    </div>
  );
}

export default Chat;
