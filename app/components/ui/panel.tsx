import * as React from "react";
import { useIsMobile } from "~/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerFooter,
} from "./drawer";

// Panel - main wrapper that switches between Drawer (mobile) and Dialog (desktop)
function Panel(props: React.ComponentProps<typeof Dialog>) {
  const isMobile = useIsMobile();
  const Component = isMobile ? Drawer : Dialog;

  return <Component data-slot="panel" {...props} />;
}

// PanelTrigger - button/element that opens the panel
function PanelTrigger(props: React.ComponentProps<typeof DialogTrigger>) {
  const isMobile = useIsMobile();
  const Component = isMobile ? DrawerTrigger : DialogTrigger;

  return <Component data-slot="panel-trigger" {...props} />;
}

// PanelContent - the main content container
function PanelContent(props: React.ComponentProps<typeof DialogContent>) {
  const isMobile = useIsMobile();
  const Component = isMobile ? DrawerContent : DialogContent;

  return <Component data-slot="panel-content" {...props} />;
}

// PanelHeader - header section containing title and description
function PanelHeader(props: React.ComponentProps<typeof DialogHeader>) {
  const isMobile = useIsMobile();
  const Component = isMobile ? DrawerHeader : DialogHeader;

  return <Component data-slot="panel-header" {...props} />;
}

// PanelTitle - the main title text
function PanelTitle(props: React.ComponentProps<typeof DialogTitle>) {
  const isMobile = useIsMobile();
  const Component = isMobile ? DrawerTitle : DialogTitle;

  return <Component data-slot="panel-title" {...props} />;
}

// PanelDescription - descriptive text below the title
function PanelDescription(
  props: React.ComponentProps<typeof DialogDescription>,
) {
  const isMobile = useIsMobile();
  const Component = isMobile ? DrawerDescription : DialogDescription;

  return <Component data-slot="panel-description" {...props} />;
}

// PanelFooter - footer section for actions
function PanelFooter(props: React.ComponentProps<typeof DialogFooter>) {
  const isMobile = useIsMobile();
  const Component = isMobile ? DrawerFooter : DialogFooter;

  return <Component data-slot="panel-footer" {...props} />;
}

export {
  Panel,
  PanelTrigger,
  PanelContent,
  PanelHeader,
  PanelTitle,
  PanelDescription,
  PanelFooter,
};
