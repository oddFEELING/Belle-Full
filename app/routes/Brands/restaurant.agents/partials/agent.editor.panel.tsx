import type { Doc } from "convex/_generated/dataModel";
import React, { useEffect, useState } from "react";
import {
  type Editor,
  EditorContent,
  Extension,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import CharacterCount from "@tiptap/extension-character-count";
import { Toggle } from "~/components/ui/toggle";
import {
  IconBold,
  IconH1,
  IconItalic,
  IconStrikethrough,
  IconTarget,
  IconUserBolt,
} from "@tabler/icons-react";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "convex/_generated/api";
import { toast } from "sonner";
import { Markdown } from "tiptap-markdown";

interface AgentEditorPanelProps {
  agent: Doc<"restaurant_agents">;
}

// Register TipTap extensions used by the editor, including word/char counting.
const extensions = [
  StarterKit,
  TextStyleKit,
  Markdown.configure({
    html: true,
    tightLists: true,
    tightListClass: "tight",
    bulletListMarker: "-",
    linkify: false,
    breaks: false,
    transformPastedText: false,
    transformCopiedText: false,
  }),
  CharacterCount.configure({}),
] satisfies Extension[];

// ~ =============================================>
// ~ ======= Menu bar
// ~ =============================================>
const MenuBar = ({
  editor,
  setView,
  onSave,
  agent,
  view,
}: {
  editor: Editor | null;
  setView: (view: "persona" | "goals") => void;
  onSave: () => void;
  agent: Doc<"restaurant_agents"> | null;
  view: "persona" | "goals";
}) => {
  const updateAgent = useMutation(api.features.agents.functions.updateAgent);
  if (!editor) return null;

  return (
    <div className="flex h-[3.5rem] w-full items-center justify-between border-b px-5">
      <div className="flex items-center gap-2">
        <Toggle
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          pressed={editor.isActive("bold")}
        >
          <IconBold size={16} strokeWidth={1.5} />
        </Toggle>

        <Toggle
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          pressed={editor.isActive("italic")}
        >
          <IconItalic size={16} strokeWidth={1.5} />
        </Toggle>

        <Toggle
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          pressed={editor.isActive("strike")}
        >
          <IconStrikethrough size={16} strokeWidth={1.5} />
        </Toggle>

        <Separator orientation="vertical" />

        <Toggle
          size="sm"
          onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
        >
          <IconH1 size={16} strokeWidth={1.5} />
        </Toggle>

        <p className="text-muted-foreground text-xs">
          Word count: {editor.storage.characterCount.words()} /100
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Select
          defaultValue="persona"
          onValueChange={(value) => setView(value as "persona" | "goals")}
        >
          <SelectTrigger
            size="sm"
            className="[&>span_svg]:text-muted-foreground/80 cursor-pointer [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
          >
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:flex [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
            <SelectItem value="persona">
              <IconUserBolt size={16} aria-hidden="true" />
              <span className="truncate">Persona</span>
            </SelectItem>
            <SelectItem value="goals">
              <IconTarget size={16} aria-hidden="true" />
              <span className="truncate">Goals</span>
            </SelectItem>
          </SelectContent>
        </Select>

        {agent && (
          <Button
            disabled={
              editor.storage.characterCount.words() === 0 ||
              editor.storage.characterCount.words() > 100 ||
              // @ts-ignore
              editor.storage.markdown?.getMarkdown() === agent[view]
            }
            size="xs"
            onClick={onSave}
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );
};

// ~ =============================================>
// ~ ======= Main Editor
// ~ =============================================>
export const AgentEditorPanel: React.FC<AgentEditorPanelProps> = ({
  agent,
}) => {
  const [view, setView] = useState<"persona" | "goals">("persona");
  const updateAgent = useMutation(api.features.agents.functions.updateAgent);

  // Create the TipTap editor instance for rich-text authoring.
  const editor = useEditor({
    extensions,
    content: agent[view],
    editorProps: {
      attributes: {
        class:
          "tiptap prose prose-sm max-w-none dark:prose-invert focus:outline-none",
      },
    },
  });

  const [, setRerenderTick] = useState(0);
  useEffect(() => {
    if (!editor) return;

    const triggerRerender = () => setRerenderTick((tick) => tick + 1);
    editor.on("transaction", triggerRerender);
    editor.on("selectionUpdate", triggerRerender);
    editor.on("update", triggerRerender);

    return () => {
      editor.off("transaction", triggerRerender);
      editor.off("selectionUpdate", triggerRerender);
      editor.off("update", triggerRerender);
    };
  }, [editor]);

  return (
    <div className="h-full w-full">
      <MenuBar
        editor={editor}
        agent={agent}
        view={view}
        setView={(view) => {
          setView(view);
          editor?.commands.setContent(agent[view] || "");
        }}
        onSave={async () => {
          await updateAgent({
            agent: agent._id,
            updateData: {
              // @ts-ignore
              [view]: editor?.storage.markdown?.getMarkdown() || agent[view],
            },
          });
          toast.success(`${view} updated successfully`);
        }}
      />
      <ScrollArea
        onClick={() => editor?.chain().focus().run()}
        className="relative h-[calc(100%-3.5rem)] w-full cursor-text overflow-x-hidden overflow-y-auto px-5 py-4"
      >
        <EditorContent editor={editor} />
      </ScrollArea>
    </div>
  );
};
