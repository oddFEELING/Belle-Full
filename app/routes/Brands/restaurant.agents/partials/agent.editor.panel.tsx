import {
  IconBold,
  IconH1,
  IconItalic,
  IconStrikethrough,
  IconTarget,
  IconUserBolt,
} from "@tabler/icons-react";
import CharacterCount from "@tiptap/extension-character-count";
import { TextStyleKit } from "@tiptap/extension-text-style";
import {
  type Editor,
  EditorContent,
  type Extension,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { api } from "convex/_generated/api";
import type { Doc } from "convex/_generated/dataModel";
import { useMutation } from "convex/react";
import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Markdown } from "tiptap-markdown";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { Toggle } from "~/components/ui/toggle";

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
          onClick={() => editor.chain().focus().toggleBold().run()}
          pressed={editor.isActive("bold")}
          size="sm"
        >
          <IconBold size={16} strokeWidth={1.5} />
        </Toggle>

        <Toggle
          onClick={() => editor.chain().focus().toggleItalic().run()}
          pressed={editor.isActive("italic")}
          size="sm"
        >
          <IconItalic size={16} strokeWidth={1.5} />
        </Toggle>

        <Toggle
          onClick={() => editor.chain().focus().toggleStrike().run()}
          pressed={editor.isActive("strike")}
          size="sm"
        >
          <IconStrikethrough size={16} strokeWidth={1.5} />
        </Toggle>

        <Separator orientation="vertical" />

        <Toggle
          onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
          size="sm"
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
            className="cursor-pointer [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80"
            size="sm"
          >
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent className="[&_*[role=option]>span>svg]:shrink-0 [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:flex [&_*[role=option]>span]:gap-2">
            <SelectItem value="persona">
              <IconUserBolt aria-hidden="true" size={16} />
              <span className="truncate">Persona</span>
            </SelectItem>
            <SelectItem value="goals">
              <IconTarget aria-hidden="true" size={16} />
              <span className="truncate">Goals</span>
            </SelectItem>
          </SelectContent>
        </Select>

        {agent && (
          <Button
            disabled={
              editor.storage.characterCount.words() === 0 ||
              editor.storage.characterCount.words() > 100 ||
              // @ts-expect-error
              editor.storage.markdown?.getMarkdown() === agent[view]
            }
            onClick={onSave}
            size="xs"
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
        agent={agent}
        editor={editor}
        onSave={async () => {
          await updateAgent({
            agent: agent._id,
            updateData: {
              // @ts-expect-error
              [view]: editor?.storage.markdown?.getMarkdown() || agent[view],
            },
          });
          toast.success(`${view} updated successfully`);
        }}
        setView={(view) => {
          setView(view);
          editor?.commands.setContent(agent[view] || "");
        }}
        view={view}
      />
      <ScrollArea
        className="relative h-[calc(100%-3.5rem)] w-full cursor-text overflow-y-auto overflow-x-hidden px-5 py-4"
        onClick={() => editor?.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </ScrollArea>
    </div>
  );
};
