import { backgrounds } from "@/options";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { usePreferencesStore } from "@/store/use-preferences-store";

export default function BackgroundSelect() {
  const background = usePreferencesStore((state) => state.background);

  return (
    <div>
      <label className="block mb-2 text-xs font-medium text-neutral-400">
        Background
      </label>
      <Select
        value={background}
        onValueChange={(bg) => bg && usePreferencesStore.setState({ background: bg })}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select Background" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(backgrounds).map(([name, bg]) => (
            <SelectItem key={name} value={name}>
              <div className="flex gap-2 items-center">
                <div className={cn("h-4 w-4 rounded-full", bg.background)} />
                <span className="capitalize">{name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
