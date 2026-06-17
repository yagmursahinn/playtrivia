"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

type InvalidCategoryScreenProps = {
  slug: string;
};

export function InvalidCategoryScreen({ slug }: InvalidCategoryScreenProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <h2 className="font-display text-3xl font-extrabold text-dark">Unknown category</h2>
      <p className="mt-4 font-body text-base font-semibold text-dark/60">
        We could not find a quiz for <span className="text-dark">{slug}</span>.
      </p>
      <div className="mt-8 w-full sm:w-auto">
        <Button href="/solo" variant="primary" size="lg" fullWidth>
          Back to Solo Setup
        </Button>
      </div>
    </div>
  );
}

type MultiplayerSetupRequiredScreenProps = {
  playPath: string;
};

export function MultiplayerSetupRequiredScreen({
  playPath,
}: MultiplayerSetupRequiredScreenProps) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-16 text-center">
      <h2 className="font-display text-3xl font-extrabold text-dark">Setup required</h2>
      <p className="mt-4 font-body text-base font-semibold text-dark/60">
        Add player names on the multiplayer setup screen before starting a game.
      </p>
      <div className="mt-8 flex w-full flex-col gap-3">
        <Button href="/multiplayer" variant="secondary" size="lg" fullWidth>
          Go to Multiplayer Setup
        </Button>
        <Link
          href={playPath}
          className="font-body text-sm font-semibold text-dark/50 hover:text-dark"
        >
          Retry after setup
        </Link>
      </div>
    </div>
  );
}
