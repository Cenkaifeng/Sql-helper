import './home.styl'

export default function Home() {
    return (
        <div className="P-home">
            <h1>MVP试用版本</h1>
            <p>所有功能在右下角小浮窗打开</p>
            <p className='subTitle'></p>
            <ul>
                <li>语言模型：GPT-3.5-turbo</li>
                <li>功能：SQL语句生成</li>
                <li>tips: 请自备api-key</li>
            </ul>
            <p className='subTitle'>插件支持域名（此外域名使用可能有样式问题）</p>
            <ul>
                <li>https://our.ones.pro/</li>
                <li>https://ones.cn/</li>
                <li>https://ones.com/</li>
            </ul>
        </div>
    )
}