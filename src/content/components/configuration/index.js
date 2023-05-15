
import { useState, useRef, React} from "react";
import { Button, Input, Form } from "antd";
// import { apiReqs, setLocalStorage } from '@/api'

function ConfigurationWindow(props) {

  const { updateData } = props;
  const [text, setText] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const apiKeyRef = useRef('apiKeyInput');
  const textAreaRef = useRef('textAreaRef');

  // 随着Input的输入变化，及时更新text
  const handleIptChange = (e) => {
    setText(e.target.value);
  };

  const presetPrompt = () => {
    const text = textAreaRef.current.resizableTextArea.textArea.value;
    const prompt = {
      role: 'user',
      content: formatTextPrompt(text),
    }
    
    updateData(prompt); // 传值到 chat
    window.localStorage.setItem('prompt', JSON.stringify(prompt));
  }

  const formatTextPrompt = (text) => {
    const lines = text.trim().split(/[\n]+/);
    const keywordMappings = lines.reduce((acc, curr, index, array) => {
      if (index % 2 === 0 && index + 1 < array.length) {
        const key = array[index].trim();
        const value = array[index + 1];
        // acc.push({ [key]: value });
        acc += `${key}: ${value},\n`;
      }
      return acc;
    }, '');

    const preSetText = `
            你是一个帮助我通过自然语言生成SQL的助手，
            给我的回答可以参考:
            1. https://clickhouse.com/docs/zh/sql-reference/functions/arithmetic-functions 和
            2. https://guide.ones.pro/wiki/#/team/LBrdb4wE/space/6XDAYB1a/page/2wHPDuJE 这两个链接，
            你需要根据我上面两个链接中的SQL使用规则提供自然语言对应的sql给我，等会我会基于自然语言要求你按照以下关键字对应的SQL语句来给我生成我需要的SQL，
            假设今年是2023年，SQL映射关系如下：`
    const results = `
      ${preSetText}
      ${keywordMappings}
      接下来的对话中我将通过自然语言向你提问，你只需要返回与此相关的SQL语句给我即可。
    `;

    // 原始代码
    // const results = `${preSetText}
    //   
    //   我的自然语言与SQL映射关系如下：
    //   ${keywordMappings.join('\n')};
    //   
    // `;

    return results;
  }

  // 保存API Key
  const setCustomApiKey = (e) => {
    const apiKey = apiKeyRef.current.input.value;
    // setApiKey(apiKey)
    window.localStorage.setItem('apiKey', apiKey);
    // setLocalStorage({apiKey}, (res) => {
    //   console.log('检验保持情况', res)
    // })
  };
  // 文本域
  const { TextArea } = Input;

  return (

    <div className="P-configuration">
      <Form layout="vertical" className="key-value">
        {/* Key & Value 表单 */}
        <Form.Item
          label="Key & Value"
          htmlFor="key&value"
          className="key-value-form"
          style={{ flexGrow: "1", height: "100%" }}
        >
          <TextArea
            ref={textAreaRef}
            placeholder="粘贴 SQL 的 Key & Value"
            id="key&value"
            value={text}
            onChange={handleIptChange}
            bordered={false}
            classNames="key&value"
          />
        </Form.Item>
        <Form.Item>
          <Button onClick={() => presetPrompt()} type="primary" block={true} htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>

      {/* API Key 表单 */}
      <Form
        layout="vertical"
        size={10}
        style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}
        className="api-key-form"
      >
        <Form.Item label="API Key" htmlFor="apiKey" style={{ width: "100%" }}>
          <Input.Password
            ref={apiKeyRef}
            name="apiKeyInput"
            id="apiKey"
            bordered={false}
            className="api_key_input"
            visibilityToggle={false}
            placeholder="sk-**********"
          />
        </Form.Item>
        <Form.Item>
          <Button type="default" htmlType="submit" onClick={setCustomApiKey}>
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ConfigurationWindow;
