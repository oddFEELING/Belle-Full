import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import type { PanelContentProps, PanelProviderProps } from "./panel.typs";
import { useIsMobile } from "~/hooks/use-mobile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate, useParams } from "react-router";
import type { Id } from "convex/_generated/dataModel";
import { z } from "zod";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { logger } from "~/lib/logger";
import { formatBytes, useFileUpload } from "~/hooks/use-file-upload";
import {
  AlertCircleIcon,
  FileUpIcon,
  Loader,
  Loader2,
  XIcon,
} from "lucide-react";
import { getFileIcon } from "~/helpers/get-file-icon";
import { useEffect, useState } from "react";
import { useUploadFile } from "@convex-dev/r2/react";
import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { IconCheck } from "@tabler/icons-react";

// ~ =============================================>
// ~ ======= Panel provider
// ~ =============================================>
const UploadRestaurantDocumentsPanelProvider: React.FC<PanelProviderProps> = ({
  children,
  open,
  onOpenChange,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="flex max-h-[85dvh] flex-col">
          <DrawerHeader className="flex-shrink-0">
            <DrawerTitle>Upload Document</DrawerTitle>
            <VisuallyHidden>
              <DrawerDescription></DrawerDescription>
            </VisuallyHidden>
          </DrawerHeader>

          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-xl [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <VisuallyHidden>
            <DialogDescription></DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

// ~ =============================================>
// ~ ======= Types
// ~ =============================================>
const RESTAURANT_DOCUMENT_CATEGORIES = [
  "FOOD_BUSINESS_REGISTRATION_CONFIRMATION",
  "FOOD_HYGIENE_CERTIFICATE",
  "FOOD_SAFETY_MANAGEMENT",
  "ALLERGEN_COMPLIANCE",
  "PREMISIS_LICENSE",
  "ALCOHOL_LIQUOR_LICENSE",
] as const;

const uploadDocumentSchema = z.object({
  category: z.enum(RESTAURANT_DOCUMENT_CATEGORIES),
  files: z.any().optional(), // File upload field
});
type UploadDocumentSchema = z.infer<typeof uploadDocumentSchema>;

const maxSize = 100 * 1024 * 1024; // 10MB default
const maxFiles = 3;

// ~ =============================================>
// ~ ======= Panel
// ~ =============================================>
const UploadRestaurantDocumentsPanel: React.FC<PanelContentProps> = ({
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  const restaurant = useParams().restaurantId as Id<"restaurants">;
  const createDocument = useMutation(
    api.restaurants.documents.createUploadedDocument,
  );
  const [uploadStatus, setUploadStatus] = useState<{
    status: "idle" | "uploading" | "success" | "error";
    currentlyUploading: string[];
    uploadedFiles: string[];
    error?: string;
  }>({ status: "idle", currentlyUploading: [], uploadedFiles: [] });
  const uploadFile = useUploadFile(api.restaurants.documents);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      clearFiles,
      getInputProps,
    },
  ] = useFileUpload({
    multiple: true,
    maxFiles,
    maxSize,
    accept: "image/*, application/pdf",
  });
  // ~ ======= Form instance ======= ~
  const form = useForm<UploadDocumentSchema>({
    resolver: zodResolver(uploadDocumentSchema),
  });

  useEffect(() => {
    if (files.length > 0) {
      logger.info({ title: "files", files });
    }
  }, [files]);

  // ~ ======= Handle submit  ======= ~
  const onSubmit = async (data: UploadDocumentSchema) => {
    logger.info({ title: "onSubmit", data });

    // Put in loading state
    setUploadStatus((prev) => ({ ...prev, status: "uploading" }));

    const fileKeys = await Promise.all(
      files.map(async (file) => {
        // Add file to currently uploading
        setUploadStatus((prev) => ({
          ...prev,
          currentlyUploading: [...prev.currentlyUploading, file.id],
        }));
        // Upload file
        const key = await uploadFile(file.file as File);
        // create doc ref in db
        const docRef = await createDocument({
          restaurant,
          key,
          name: file.file.name,
          size: file.file.size,
          type: "IMAGE",
          category: data.category,
        });
        // Add file to uploaded files and remove from currently uploading
        setUploadStatus((prev) => ({
          ...prev,
          uploadedFiles: [...prev.uploadedFiles, file.id],
          currentlyUploading: prev.currentlyUploading.filter(
            (id) => id !== file.id,
          ),
        }));
        return { key, docRef };
      }),
    );

    logger.info(fileKeys);

    setUploadStatus((prev) => ({ ...prev, status: "success" }));
    onOpenChange(false);
  };

  useEffect(() => {
    form.reset();
    clearFiles();
  }, [open]);

  const isMobile = useIsMobile();

  return (
    <UploadRestaurantDocumentsPanelProvider
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={
            isMobile
              ? "flex flex-col"
              : "mt-5 grid h-full grid-cols-1 gap-5 px-4 lg:px-0"
          }
        >
          {/* Mobile: Scrollable content area */}
          <div className={isMobile ? "overflow-y-auto px-4 pb-4" : "contents"}>
            <div className={isMobile ? "space-y-4" : "contents"}>
              {/* ~ ======= Category ======= ~ */}
              <FormField
                name="category"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document name</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a document category" />
                        </SelectTrigger>
                        <SelectContent>
                          {RESTAURANT_DOCUMENT_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* ~ ======= Files ======= ~ */}
              <FormField
                name="files"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Files</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        {/* Drop area */}
                        <div
                          role="button"
                          onClick={openFileDialog}
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
                          onDragOver={handleDragOver}
                          onDrop={handleDrop}
                          data-dragging={isDragging || undefined}
                          className={`border-input hover:bg-accent/50 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors has-disabled:pointer-events-none has-disabled:opacity-50 has-[input:focus]:ring-[3px] ${isMobile ? "min-h-32" : "min-h-40"}`}
                        >
                          <Input
                            {...getInputProps()}
                            className="sr-only"
                            aria-label="Upload files"
                          />

                          <div className="flex flex-col items-center justify-center text-center">
                            <div
                              className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                              aria-hidden="true"
                            >
                              <FileUpIcon className="size-4 opacity-60" />
                            </div>
                            <p className="mb-1.5 text-sm font-medium">
                              Upload files
                            </p>
                            <p className="text-muted-foreground mb-2 text-xs">
                              Drag & drop or click to browse
                            </p>
                            <div className="text-muted-foreground/70 flex flex-wrap justify-center gap-1 text-xs">
                              <span>All files</span>
                              <span>∙</span>
                              <span>Max {maxFiles} files</span>
                              <span>∙</span>
                              <span>Up to {formatBytes(maxSize)}</span>
                            </div>
                          </div>
                        </div>

                        {errors.length > 0 && (
                          <div
                            className="text-destructive flex items-center gap-1 text-xs"
                            role="alert"
                          >
                            <AlertCircleIcon className="size-3 shrink-0" />
                            <span>{errors[0]}</span>
                          </div>
                        )}

                        {/* File list */}
                        {files.length > 0 && (
                          <div className="space-y-2">
                            {files.map((file) => (
                              <div
                                key={file.id}
                                className="bg-background flex items-center justify-between gap-2 rounded-lg border p-2 pe-3"
                              >
                                <div className="flex items-center gap-3 overflow-hidden">
                                  <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                                    {getFileIcon(file)}
                                  </div>
                                  <div className="flex min-w-0 flex-col gap-0.5">
                                    <p className="truncate text-[13px] font-medium">
                                      {file.file instanceof File
                                        ? file.file.name
                                        : file.file.name}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                      {formatBytes(
                                        file.file instanceof File
                                          ? file.file.size
                                          : file.file.size,
                                      )}
                                    </p>
                                  </div>
                                </div>

                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-muted-foreground/80 hover:text-foreground -me-2 size-8 hover:bg-transparent"
                                  onClick={() => removeFile(file.id)}
                                  aria-label="Remove file"
                                >
                                  {uploadStatus.status === "idle" && (
                                    <XIcon
                                      className="size-4"
                                      aria-hidden="true"
                                    />
                                  )}

                                  {uploadStatus.status === "uploading" &&
                                    uploadStatus.currentlyUploading.includes(
                                      file.id,
                                    ) && (
                                      <Loader2 className="size-4 animate-spin" />
                                    )}

                                  {uploadStatus.uploadedFiles.includes(
                                    file.id,
                                  ) && <IconCheck className="size-4" />}
                                </Button>
                              </div>
                            ))}

                            {/* Remove all files button */}
                            {files.length > 1 && (
                              <div>
                                <Button
                                  size="sm"
                                  disabled={uploadStatus.status !== "idle"}
                                  variant="outline"
                                  onClick={clearFiles}
                                >
                                  Remove all files
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* ~ ======= Buttons ======= ~ */}
          <div
            className={
              isMobile
                ? "bg-background/95 supports-[backdrop-filter]:bg-background/60 flex-shrink-0 border-t p-4 backdrop-blur"
                : "mt-5 flex justify-end gap-2"
            }
          >
            <div
              className={
                isMobile ? "flex w-full gap-2" : "flex justify-end gap-2"
              }
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className={isMobile ? "flex-1" : ""}
              >
                Cancel
              </Button>
              <Button type="submit" className={isMobile ? "flex-1" : "px-8"}>
                Upload
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </UploadRestaurantDocumentsPanelProvider>
  );
};

export default UploadRestaurantDocumentsPanel;
