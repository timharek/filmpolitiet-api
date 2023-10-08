import IconDice1 from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/dice-1.tsx";
import IconDice2 from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/dice-2.tsx";
import IconDice3 from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/dice-3.tsx";
import IconDice4 from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/dice-4.tsx";
import IconDice5 from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/dice-5.tsx";
import IconDice6 from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/dice-6.tsx";

interface DiceProps {
  side: number;
  className?: string;
}
export function Dice({ side, className }: DiceProps) {
  const ariaLabel = `Die ${side}`;
  if (side === 1) {
    return <IconDice1 class={className} aria-label={ariaLabel} />;
  }
  if (side === 2) {
    return <IconDice2 class={className} aria-label={ariaLabel} />;
  }
  if (side === 3) {
    return <IconDice3 class={className} aria-label={ariaLabel} />;
  }
  if (side === 4) {
    return <IconDice4 class={className} aria-label={ariaLabel} />;
  }
  if (side === 5) {
    return <IconDice5 class={className} aria-label={ariaLabel} />;
  }
  return <IconDice6 class={className} aria-label={ariaLabel} />;
}
