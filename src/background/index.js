/*global chrome*/
import { apiRequest } from '@/api'
// manifest.json的Permissions配置需添加declarativeContent权限
// 注意：V3 开始 background script 运行在 Server Worker 上，不再基于 DOM 所以没有window全局变量
chrome.runtime.onInstalled.addListener(function () {
    // 默认先禁止Page Action。如果不加这一句，则无法生效下面的规则
    chrome.action.disable()
    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        // 设置规则
        let rule = {
            // 运行插件运行的页面URL规则，规则为了限制插件使用的范围，演示加入 ones.cn 
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        // 适配所有域名以“www.”开头的网页
                        // hostPrefix: 'www.',
                        hostPrefix: 'https://our.ones.pro/',
                        hostPrefix: 'https://ones.cn/',
                        // 海外官网
                        hostPrefix: 'ones.com',
                        // 适配所有域名以“.antgroup.com”结尾的网页
                        // hostSuffix: '.antgroup.com',
                        // 适配域名为“ant-design.antgroup.com”的网页
                        // hostEquals: 'ant-design.antgroup.com',
                        // 适配https协议的网页
                        // schemes: ['https'],
                    },
                }),
            ],
            actions: [new chrome.declarativeContent.ShowAction()],
        }
        // 整合所有规则后执行
        const rules = [rule]
        chrome.declarativeContent.onPageChanged.addRules(rules)
    })

    chrome.runtime.onMessage.addListener(function (
        request,
        sender,
        sendResponse
    ) {
        // 接收来自content script的消息，requset里不允许传递function和file类型的参数
        chrome.tabs.query(
            { currentWindow: true, active: true },
            function (tabs) {
                const { contentRequest } = request
                // 接收来自content的api请求
                if (contentRequest === 'apiRequest') {
                    let { config } = request
                    // API请求成功的回调
                    config.success = (data) => {
                        data.result = 'succ'
                        sendResponse(data)
                    }
                    // API请求失败的回调
                    config.fail = (msg) => {
                        sendResponse({
                            result: 'fail',
                            msg,
                        })
                    }
                    // 发起请求
                    apiRequest(config)
                }

            }
        )
        if(request.action === 'getLocalStorage') {
            // 获取本地存储数据
            chrome.storage.local.get(request.keys, result => {
                // 将结果发送回内容脚本
                sendResponse(result);
            });
        } else if(request.action === 'setLocalStorage') {
            // 本地存储数据
            chrome.storage.local.set(request.keys, result => {
                // 将结果发送回内容脚本
                sendResponse(result);
            });
        } else if(request.action === 'removeLocalStorage') {
            // 移除本地存储数据
            chrome.storage.local.remove(request.keys, result => {
                // 将结果发送回内容脚本
                sendResponse(result);
            });
        }

        return true
    })
})

// // 监听来自内容脚本的消息
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === 'getLocalStorage') {
//     // 获取本地存储数据
//     chrome.storage.local.get(message.keys, result => {
//       // 将结果发送回内容脚本
//       sendResponse(result);
//     });
//     // 返回 true 以确保 sendResponse 在异步调用中保持有效
//     return true;
//   }
// });