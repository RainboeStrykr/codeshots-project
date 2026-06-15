import { ArrowDownToLine, DownloadIcon, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "react-hot-toast";
import { toBlob, toPng, toSvg } from "html-to-image";
import { usePreferencesStore } from "@/store/use-preferences-store";
import { getFullFileName } from "@/store/use-preferences-store";

export default function ExportOptions({
  targetRef,
}: {
  targetRef: React.RefObject<HTMLDivElement>;
}) {
  const fileName = usePreferencesStore((state) => state.fileName);
  const language = usePreferencesStore((state) => state.language);
  const title = getFullFileName(fileName, language);

  const copyImage = async () => {
    const loading = toast.loading("Copying...");
    try {
      const imgBlob = await toBlob(targetRef.current, { pixelRatio: 2 });
      const img = new ClipboardItem({ "image/png": imgBlob as Blob });
      navigator.clipboard.write([img]);
      toast.remove(loading);
      toast.success("Image copied to clipboard!");
    } catch (error) {
      console.error(error);
      toast.remove(loading);
      toast.error("Something went wrong!");
    }
  };

  const saveImage = async (name: string, format: string) => {
    const loading = toast.loading(`Exporting ${format} image...`);
    try {
      let imgUrl, filename;
      switch (format) {
        case "PNG":
          imgUrl = await toPng(targetRef.current, { pixelRatio: 2 });
          filename = `${name}.png`;
          break;
        case "SVG":
          imgUrl = await toSvg(targetRef.current, { pixelRatio: 2 });
          filename = `${name}.svg`;
          break;
        default:
          return;
      }
      const a = document.createElement("a");
      a.href = imgUrl;
      a.download = filename;
      a.click();
      toast.remove(loading);
      toast.success("Exported successfully!");
    } catch (error) {
      console.error(error);
      toast.remove(loading);
      toast.error("Something went wrong!");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button />}>
        <ArrowDownToLine />
        Export
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuItem className="gap-2" onClick={copyImage}>
          <ImageIcon />
          Copy Image
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="gap-2"
          onClick={() => saveImage(title, "PNG")}
        >
          <DownloadIcon />
          Save as PNG
        </DropdownMenuItem>

        <DropdownMenuItem
          className="gap-2"
          onClick={() => saveImage(title, "SVG")}
        >
          <DownloadIcon />
          Save as SVG
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
