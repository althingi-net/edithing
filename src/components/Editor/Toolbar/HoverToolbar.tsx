import { BoldOutlined } from "@ant-design/icons"
import styles from './HoverToolbar.module.css'
import { Button } from "antd"
import { FC, useEffect, useRef } from "react"
import { Editor, Range, Text } from "slate"
import { useFocused, useSlate } from "slate-react"
import Portal from "../../Portal"

type Marks = keyof Omit<Text, 'text' | 'title' | 'name' | 'nr'>

const HoveringToolbar = () => {
    const ref = useRef<HTMLDivElement>(null)
    const editor = useSlate()
    const inFocus = useFocused()

    useEffect(() => {
        const el = ref.current
        const { selection } = editor
        const domSelection = window.getSelection()

        if (!el) {
            return
        }

        if (
            !domSelection ||
            !selection ||
            !inFocus ||
            Range.isCollapsed(selection) ||
            Editor.string(editor, selection) === ''
        ) {
            el.removeAttribute('style')
            return
        }

        const domRange = domSelection.getRangeAt(0)
        const rect = domRange.getBoundingClientRect()
        el.style.opacity = '1'
        el.style.top = `${rect.top + window.scrollY - el.offsetHeight}px`
        el.style.left = `${rect.left +
            window.scrollX -
            el.offsetWidth / 2 +
            rect.width / 2}px`
        console.log('huiyd', el.style.top, el.style.left, { rect, scrollX: window.scrollX, scrollY: window.scrollY, offsetWidth: el.offsetWidth, offsetHeight: el.offsetHeight })
    })

    return (
        <Portal>
            <div
                className={styles.toolbar}
                ref={ref}
                onMouseDown={e => {
                    // prevent toolbar from taking focus away from editor
                    e.preventDefault()
                }}
            >
                <FormatButton format="bold" icon={<BoldOutlined />} />
                <FormatButton format="bold" icon="T" />
                <FormatButton format="bold" icon="N" />
            </div>
        </Portal>
    )
}

const FormatButton: FC<{ format: Marks, icon: any }> = ({ format, icon }) => {
    const editor = useSlate()
    return (
        <Button
            size="small"
            type="primary"
            style={{ width: '30px'}}
            ghost={!isMarkActive(editor, format)}
            onClick={() => toggleMark(editor, format)}
        >
            {icon}
        </Button>
    )
}

const toggleMark = (editor: Editor, format: Marks) => {
    const isActive = isMarkActive(editor, format)
  
    if (isActive) {
      Editor.removeMark(editor, format)
    } else {
      Editor.addMark(editor, format, true)
    }
  }
  
  const isMarkActive = (editor: Editor, format: Marks) => {
    const marks = Editor.marks(editor)
    return marks ? marks[format] === true : false
  }


export default HoveringToolbar;