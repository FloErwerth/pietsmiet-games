import { PropsWithChildren, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import "./styles.css";

const CollapsibleChild = ({ children }: PropsWithChildren) => {
  return (
    <div className="rounded-md border px-4 py-3 font-mono text-sm">
      {children}
    </div>
  );
};

export const HowTo = () => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible className="wrapper" open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm font-semibold">Wie erstelle ich einen Raum?</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="flex flex-col gap-3 pt-5">
        <CollapsibleChild>1. Eingeben des Namens</CollapsibleChild>
        <CollapsibleChild>
          2. Aussuchen des gespielten Kartendecks
        </CollapsibleChild>
        <CollapsibleChild>
          3. Einladen der Mitspieler mit dem generierten Link
        </CollapsibleChild>
      </CollapsibleContent>
    </Collapsible>
  );
};
