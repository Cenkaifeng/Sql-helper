import { RouterProvider } from 'react-router-dom'
import { globalRouters } from '@/popup/router'
import './popup.styl'

// 在popup 调试 content script, 仅用于开发环境，build前需要注释
// import '@/content'

export default function Popup() {
    return <RouterProvider router={globalRouters} />
}