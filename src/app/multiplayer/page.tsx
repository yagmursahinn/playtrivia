"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header, PageContainer, PageHeader } from "@/components/layout";
import { Button, PlayerInput, PlayerSelector } from "@/components/ui";
import { OverwriteProgressDialog } from "@/components/quiz/OverwriteProgressDialog";
import { useQuizSetup } from "@/hooks/quiz";
import { getPlayPath } from "@/lib/quiz/routes";
import {
  getSavedProgressConflict,
  type SavedProgressSummary,
} from "@/lib/quiz/progress-storage";
import type { PlayerCount } from "@/types";

const DEFAULT_NAMES = ["Player 1", "Player 2", "Player 3", "Player 4"];

export default function MultiplayerSetupPage() {
  const router = useRouter();
  const { initMultiplayer } = useQuizSetup();
  const [playerCount, setPlayerCount] = useState<PlayerCount>(2);
  const [names, setNames] = useState<string[]>(DEFAULT_NAMES);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState(false);
  const [savedConflict, setSavedConflict] = useState<SavedProgressSummary | null>(null);

  const visiblePlayers = useMemo(
    () => Array.from({ length: playerCount }, (_, i) => i),
    [playerCount],
  );

  const handleNameChange = (index: number, value: string) => {
    setNames((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const allNamesFilled = visiblePlayers.every(
    (i) => names[i]?.trim().length > 0,
  );

  const startMultiplayer = () => {
    const playerNames = visiblePlayers.map((index) => names[index]!.trim());
    initMultiplayer(playerNames);
    router.push(getPlayPath("mixed", "multiplayer"));
  };

  const handleStart = () => {
    const conflict = getSavedProgressConflict({
      categoryId: "mixed",
      mode: "multiplayer",
      sessionType: "standard",
    });

    if (conflict) {
      setSavedConflict(conflict);
      setShowOverwriteConfirm(true);
      return;
    }

    startMultiplayer();
  };

  return (
    <>
      <Header />
      <PageContainer narrow>
        <PageHeader
          icon="multiplayer"
          title="Multiplayer"
          subtitle="Gather your crew and compete head-to-head"
        />

        <section className="mb-10">
          <h2 className="mb-4 text-center font-display text-lg font-bold text-dark sm:text-xl">
            How many players?
          </h2>
          <PlayerSelector value={playerCount} onChange={setPlayerCount} />
        </section>

        <section>
          <h2 className="mb-5 text-center font-display text-lg font-bold text-dark sm:text-xl">
            Enter player names
          </h2>
          <div className="space-y-4">
            {visiblePlayers.map((index) => (
              <PlayerInput
                key={index}
                index={index}
                accentIndex={index}
                label={`Player ${index + 1}`}
                value={names[index] ?? ""}
                onChange={(value) => handleNameChange(index, value)}
                placeholder={`Player ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <div className="mt-10 flex flex-col items-center sm:mt-12">
          <Button
            variant="secondary"
            size="xl"
            fullWidth
            className="sm:max-w-sm"
            disabled={!allNamesFilled}
            onClick={handleStart}
          >
            Start Game
          </Button>
          {!allNamesFilled ? (
            <p className="mt-3 font-body text-sm font-semibold text-dark/50" role="status">
              Enter all player names to start.
            </p>
          ) : null}
        </div>
      </PageContainer>

      <OverwriteProgressDialog
        open={showOverwriteConfirm}
        saved={savedConflict}
        onConfirm={() => {
          setShowOverwriteConfirm(false);
          startMultiplayer();
        }}
        onCancel={() => {
          setShowOverwriteConfirm(false);
          setSavedConflict(null);
        }}
      />
    </>
  );
}
