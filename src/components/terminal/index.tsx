import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"

import { Terminal as Xterm } from "xterm"
import { AttachAddon } from 'xterm-addon-attach'
import { FitAddon } from "xterm-addon-fit"
import { WebLinksAddon } from "xterm-addon-web-links"
import 'xterm/css/xterm.css'

/**
 * term属性
 */
export type TermProps = {
    id?: string
    url: string
    [other: string]: any
}

/**
 * term组件
 * @param props 
 * @param ref 
 * @returns 
 */
let Terminal: React.FC<TermProps> = (props: TermProps, ref: any) => {

    const { id, url } = props

    /**
     * xterm容器
     */
    const containerRef = useRef<HTMLDivElement>(null)
    /**
     * xterm对象
     */
    const xtermRef = useRef<Xterm>()
    /**
     * fit对象
     */
    const fitAddonRef = useRef<FitAddon>()
    /**
     * websocket对象
     */
    const websocketRef = useRef<WebSocket>()

    /**
     * 观察resize
     */
    const resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries) || !entries.length) {
            return;
        }
        setTimeout(() => {
            fitAddonRef.current?.fit()
        }, 50);
    })

    /**
     * 组件功能
     */
    useImperativeHandle(ref, () => ({

    }))

    /**
     * 加载
     */
    useEffect(() => {
        containerRef.current && resizeObserver.observe(containerRef.current!)
        initXterm()
    }, [])

    /**
     * 连接
     */
    useEffect(() => {
        url && websocketRef.current?.close()
        url && createWebSocketConnection(url)
    }, [url])

    /**
     * 初始化xterm
     */
    const initXterm = () => {
        const xterm = new Xterm({
            cursorStyle: 'underline',
            cursorBlink: true
        })
        xterm.onResize((e: any) => {
            // console.log('onResize ->', e)
            resize(e)
        })
        xterm.onBell((e: any) => {
            console.log('onBell ->', e)
        })
        const fitAddon = new FitAddon()
        xterm.loadAddon(fitAddon)
        xterm.loadAddon(new WebLinksAddon((e, uri) => {
            console.log(e, uri)
        }))
        xterm.open(containerRef.current!)
        xterm?.focus()
        fitAddon.fit()
        fitAddonRef.current = fitAddon
        xtermRef.current = xterm
    }

    /**
     * 创建websocket连接
     */
    const createWebSocketConnection = (uri: string) => {
        const ws = new WebSocket(uri)
        ws.onopen = onopen
        ws.onmessage = onmessage
        ws.onclose = onclose
        ws.onerror = onerror
        xtermRef.current?.loadAddon(new AttachAddon(ws))
        websocketRef.current = ws
    }

    /**
     * websocket连接
     */
    const onopen = () => {
        console.log('connect...')
    }

    /**
     * websocket消息
     * @param e 
     */
    const onmessage = (e: any) => {
        console.log('message ->', e)
    }

    /**
     * websocket断链
     * @param e 
     */
    const onclose = (e: any) => {
        console.log('close ->', e)
        createWebSocketConnection(url)
    }

    /**
     * websocket异常
     * @param e 
     */
    const onerror = (e: any) => {
        console.log('error ->', e)
    }
    
    /**
     * resize
     * @param size 
     */
    const resize = (size: any) => {
        websocketRef.current?.send(`#resize ${size.cols} ${size.rows}#`)
    }

    return <div id={id} ref={containerRef} style={{ width: '100%', height: '100%' }}></div>

}

Terminal = forwardRef(Terminal as any)

export default Terminal