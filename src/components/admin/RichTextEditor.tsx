"use client";

/**
 * Éditeur de texte riche (admin) — basé sur TipTap.
 *
 * Rôle : permettre de rédiger du contenu HTML (articles de blog) avec une barre d’outils
 * (gras/italique/listes/liens/images, etc.).
 */
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import {
  LuBold, LuItalic, LuUnderline, LuList, LuListOrdered,
  LuLink, LuImage, LuHeading2, LuHeading3, LuQuote,
  LuUndo2, LuRedo2, LuRemoveFormatting,
  LuAlignLeft, LuAlignCenter, LuAlignRight,
} from "react-icons/lu";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
      openOnClick: false,
      autolink: true,
      }),
      TextStyle,
      FontFamily,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Color,
      Image,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor: e }: any) => onChange(e.getHTML()),
  });

  if (!editor) return null;

  const btnClass = (active: boolean) =>
    `rounded p-1.5 transition-colors flex items-center justify-center ${
      active
        ? "bg-primary/20 text-primary"
        : "text-text-light hover:bg-warm/50 hover:text-text"
    }`;

  const addLink = () => {
    const url = window.prompt("URL du lien :");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("URL de l'image :");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="mt-1 overflow-hidden rounded-xl border border-warm-dark/40 bg-white">
      {/* ── Barre d'outils ── */}
      <div className="flex flex-wrap items-center gap-1 border-b border-warm-dark/20 bg-warm/20 p-1.5">

      {/* Police d'écriture */}
      <select
        onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
        className="bg-transparent text-sm border border-warm-dark/20 rounded px-1 outline-none h-8"
        value={editor.getAttributes("textStyle").fontFamily || ""}
      >
        <option value="">Par défaut</option>
        <option value="Inter">Inter</option>
        <option value="serif">Serif</option>
        <option value="monospace">Monospace</option>
        <option value="Comic Sans MS, Comic Sans">Comic Sans</option>
      </select>

      <div className="mx-1 h-5 w-px bg-warm-dark/20" />

      {/* Titres */}
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive("heading", { level: 2 }))} title="Titre 2"><LuHeading2 className="h-4 w-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive("heading", { level: 3 }))} title="Titre 3"><LuHeading3 className="h-4 w-4" /></button>

      <div className="mx-1 h-5 w-px bg-warm-dark/20" />

      {/* Formatage du texte */}
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive("bold"))} title="Gras"><LuBold className="h-4 w-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive("italic"))} title="Italique"><LuItalic className="h-4 w-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive("underline"))} title="Souligné"><LuUnderline className="h-4 w-4" /></button>

      <div className="mx-1 h-5 w-px bg-warm-dark/20" />

      {/* Alignement */}
      <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={btnClass(editor.isActive({ textAlign: "left" }))} title="Gauche"><LuAlignLeft className="h-4 w-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={btnClass(editor.isActive({ textAlign: "center" }))} title="Centrer"><LuAlignCenter className="h-4 w-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={btnClass(editor.isActive({ textAlign: "right" }))} title="Droite"><LuAlignRight className="h-4 w-4" /></button>

      <div className="mx-1 h-5 w-px bg-warm-dark/20" />

      {/* Couleur du texte */}
      <div className="flex items-center gap-1 px-1" title="Couleur du texte">
        <input
        type="color"
        onInput={(e) => editor.chain().focus().setColor(e.currentTarget.value).run()}
        value={editor.getAttributes("textStyle").color || "#000000"}
        className="h-6 w-6 cursor-pointer appearance-none rounded border-none bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-warm-dark/40"
        />
        <button type="button" onClick={() => editor.chain().focus().unsetColor().run()} className={btnClass(false)} title="Réinitialiser"><LuRemoveFormatting className="h-4 w-4" /></button>
      </div>

      <div className="mx-1 h-5 w-px bg-warm-dark/20" />

      {/* Listes et citations */}
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive("bulletList"))} title="Liste à puces"><LuList className="h-4 w-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive("orderedList"))} title="Liste numérotée"><LuListOrdered className="h-4 w-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive("blockquote"))} title="Citation"><LuQuote className="h-4 w-4" /></button>

      <div className="mx-1 h-5 w-px bg-warm-dark/20" />

      {/* Médias */}
      <button type="button" onClick={addLink} className={btnClass(editor.isActive("link"))} title="Lien"><LuLink className="h-4 w-4" /></button>
      <button type="button" onClick={addImage} className={btnClass(false)} title="Image"><LuImage className="h-4 w-4" /></button>

      <div className="mx-1 h-5 w-px bg-warm-dark/20" />

      {/* Historique */}
      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={btnClass(false) + " disabled:opacity-30"} title="Annuler"><LuUndo2 className="h-4 w-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={btnClass(false) + " disabled:opacity-30"} title="Rétablir"><LuRedo2 className="h-4 w-4" /></button>
      </div>

      {/* Contenu de l'éditeur avec les styles visuels explicites */}
      <EditorContent
      editor={editor}
      className="
        p-4
        [&_.ProseMirror]:min-h-[200px]
        [&_.ProseMirror]:outline-none

        [&_.ProseMirror_h2]:text-2xl
        [&_.ProseMirror_h2]:font-bold
        [&_.ProseMirror_h2]:mt-4
        [&_.ProseMirror_h2]:mb-2

        [&_.ProseMirror_h3]:text-xl
        [&_.ProseMirror_h3]:font-semibold
        [&_.ProseMirror_h3]:mt-3
        [&_.ProseMirror_h3]:mb-1

        [&_.ProseMirror_strong]:font-bold
        [&_.ProseMirror_em]:italic
        [&_.ProseMirror_u]:underline

        [&_.ProseMirror_ul]:list-disc
        [&_.ProseMirror_ul]:pl-6
        [&_.ProseMirror_ul]:my-2

        [&_.ProseMirror_ol]:list-decimal
        [&_.ProseMirror_ol]:pl-6
        [&_.ProseMirror_ol]:my-2

        [&_.ProseMirror_li]:my-0.5

        [&_.ProseMirror_blockquote]:border-l-4
        [&_.ProseMirror_blockquote]:border-warm-dark/40
        [&_.ProseMirror_blockquote]:pl-4
        [&_.ProseMirror_blockquote]:italic
        [&_.ProseMirror_blockquote]:text-text-light
        [&_.ProseMirror_blockquote]:my-3

        [&_.ProseMirror_a]:text-primary
        [&_.ProseMirror_a]:underline

        [&_.ProseMirror_img]:max-w-full
        [&_.ProseMirror_img]:rounded
        [&_.ProseMirror_img]:my-2

        [&_.ProseMirror_p]:leading-relaxed
        [&_.ProseMirror_p]:my-1
      "
      />
    </div>
  );
}