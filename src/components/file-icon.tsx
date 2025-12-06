import type { FileType } from "@/lib/types";
import { File, FileImage, FileText, FileVideo, FileSpreadsheet } from "lucide-react";

interface FileIconProps {
  type: FileType;
  className?: string;
}

export function FileIcon({ type, className }: FileIconProps) {
  const commonClass = "h-6 w-6 text-muted-foreground";
  const finalClassName = [commonClass, className].filter(Boolean).join(' ');

  switch (type) {
    case "image":
      return <FileImage className={finalClassName} />;
    case "video":
      return <FileVideo className={finalClassName} />;
    case "document":
      return <FileText className={finalClassName} />;
    case "spreadsheet":
      return <FileSpreadsheet className={finalClassName} />;
    default:
      return <File className={finalClassName} />;
  }
}
