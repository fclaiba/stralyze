"use client"

import { useState, useEffect } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, ListOrdered, LinkIcon, ImageIcon, AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import { Extension } from "@tiptap/core"

// Add this CSS class definition
const wrapperStyles = {
  ".overflow-wrap-anywhere": {
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
    maxWidth: "100%",
  },
}

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder = "Write something..." }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image,
      // Add this extension to enforce text wrapping
      Extension.create({
        name: "textWrap",
        addGlobalAttributes() {
          return [
            {
              types: ["paragraph", "heading"],
              attributes: {
                class: {
                  default: "break-words overflow-wrap-anywhere",
                },
              },
            },
          ]
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const setLink = () => {
    const url = window.prompt("URL")
    if (url) {
      editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
    }
  }

  const addImage = () => {
    const url = window.prompt("Image URL")
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div className="border border-gray-700 rounded-md overflow-hidden bg-[#1a1e2a] w-full" style={{ maxWidth: "100%" }}>
      <div className="bg-gray-800 p-2 flex flex-wrap gap-1 border-b border-gray-700">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`${editor?.isActive("bold") ? "bg-gray-700" : ""} text-white hover:bg-gray-700 hover:text-white`}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`${editor?.isActive("italic") ? "bg-gray-700" : ""} text-white hover:bg-gray-700 hover:text-white`}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`${editor?.isActive("bulletList") ? "bg-gray-700" : ""} text-white hover:bg-gray-700 hover:text-white`}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`${editor?.isActive("orderedList") ? "bg-gray-700" : ""} text-white hover:bg-gray-700 hover:text-white`}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={setLink}
          className={`${editor?.isActive("link") ? "bg-gray-700" : ""} text-white hover:bg-gray-700 hover:text-white`}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={addImage}
          className="text-white hover:bg-gray-700 hover:text-white"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          className={`${editor?.isActive({ textAlign: "left" }) ? "bg-gray-700" : ""} text-white hover:bg-gray-700 hover:text-white`}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          className={`${editor?.isActive({ textAlign: "center" }) ? "bg-gray-700" : ""} text-white hover:bg-gray-700 hover:text-white`}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          className={`${editor?.isActive({ textAlign: "right" }) ? "bg-gray-700" : ""} text-white hover:bg-gray-700 hover:text-white`}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent
        editor={editor}
        className="p-4 min-h-[200px] text-white prose prose-invert max-w-none overflow-wrap-anywhere break-words"
      />
    </div>
  )
}
