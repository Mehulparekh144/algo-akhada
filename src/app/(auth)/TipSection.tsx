import { Lightbulb, Plus } from "lucide-react";
import { sample } from "lodash";
import { advancedInterviewTips } from "@/assets/data/advanced-leetcode-interview-tips";

export default function TipSection() {
  function getRandomAdvancedInterviewTip() {
    return sample(advancedInterviewTips)?.tip;
  }
  const tip = getRandomAdvancedInterviewTip();

  return (
    <div className="border-2 m-24 bg-gradient-to-br from-primary-foreground to-primary-foreground/50 flex flex-col items-center justify-center border-primary/50 shadow-sm w-96 h-96 relative">
      <Plus className="w-8 h-8 text-primary/80 absolute -top-4 -left-4" />
      <Plus className="w-8 h-8 text-primary/80 absolute -bottom-4 -left-4" />
      <Plus className="w-8 h-8 text-primary/80 absolute -top-4 -right-4" />
      <Plus className="w-8 h-8 text-primary/80 absolute -bottom-4 -right-4" />
      <div className="font-display text-muted-foreground space-y-2 px-4 text-pretty">
        <p className="text-3xl font-bold text-yellow-500 flex items-center gap-2">
          Helpful Tip <Lightbulb className="h-9 w-9" />
        </p>
        <p className="text-xl">{tip}</p>
      </div>
    </div>
  );
}
