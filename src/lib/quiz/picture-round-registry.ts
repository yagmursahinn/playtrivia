import { logError, logWarning } from "@/lib/monitoring/errors";

type PictureRoundCategory = "general-knowledge" | "science" | "geography" | "history";

type PictureRoundAsset = {
  id: string;
  src: string;
  category: PictureRoundCategory;
};

type AssetDefinition = {
  id: string;
  file: string;
};

const CATEGORY_IMAGE_PREFIX: Record<string, string> = {
  general: "gk",
  science: "sci",
  geography: "geo",
  history: "hist",
};

const GENERAL_KNOWLEDGE_ASSETS: AssetDefinition[] = [
  { id: "gk-pr-1", file: "gk-pr-1.png" },
  { id: "gk-pr-2", file: "gk-pr-2.png" },
  { id: "gk-pr-3", file: "gk-pr-3.png" },
  { id: "gk-pr-4", file: "gk-pr-4.png" },
  { id: "gk-pr-5", file: "gk-pr-5.png" },
  { id: "gk-pr-6", file: "gk-pr-6.png" },
  { id: "gk-pr-7", file: "gk-pr-7.png" },
  { id: "gk-pr-8", file: "gk-pr-8.png" },
  { id: "gk-pr-9", file: "gk-pr-9.png" },
  { id: "gk-pr-10", file: "gk-pr-10.png" },
  { id: "gk-pr-11", file: "gk-pr-11.png" },
  { id: "gk-pr-12", file: "gk-pr-12.png" },
];

const SCIENCE_ASSETS: AssetDefinition[] = [
  { id: "dna", file: "dna.png" },
  { id: "microscope", file: "microscope.png" },
  { id: "saturn", file: "saturn.png" },
  { id: "atom", file: "atom.png" },
  { id: "moon", file: "moon.png" },
  { id: "cell", file: "cell.png" },
  { id: "flask", file: "flask.png" },
  { id: "magnet", file: "magnet.png" },
  { id: "volcano", file: "volcano.png" },
  { id: "thermometer", file: "thermometer.png" },
  { id: "telescope", file: "telescope.png" },
  { id: "forest", file: "forest.png" },
];

/** Maps science picture-round question idSuffix values to registry image ids. */
export const SCIENCE_PICTURE_QUESTION_IMAGE_MAP: Record<string, string> = {
  "pc-1": "dna",
  "pc-2": "microscope",
  "pc-3": "saturn",
  "pc-4": "atom",
  "pc-5": "moon",
  "pc-6": "cell",
  "pc-7": "flask",
  "pc-8": "magnet",
  "pc-9": "volcano",
  "pc-10": "thermometer",
  "pc-11": "telescope",
  "pc-12": "forest",
};

const GEOGRAPHY_ASSETS: AssetDefinition[] = [
  { id: "geo-pic-great-wall", file: "geo-pic-great-wall.png" },
  { id: "geo-pic-machu-picchu", file: "geo-pic-machu-picchu.png" },
  { id: "geo-pic-taj-mahal", file: "geo-pic-taj-mahal.png" },
  { id: "geo-pic-sydney-opera", file: "geo-pic-sydney-opera.png" },
  { id: "geo-pic-eiffel-tower", file: "geo-pic-eiffel-tower.png" },
  { id: "geo-pic-amazon-river", file: "geo-pic-amazon-river.png" },
  { id: "geo-pic-denali", file: "geo-pic-denali.png" },
  { id: "geo-pic-canada-flag", file: "geo-pic-canada-flag.png" },
  { id: "geo-pic-reykjavik", file: "geo-pic-reykjavik.png" },
  { id: "geo-pic-lake-victoria", file: "geo-pic-lake-victoria.png" },
  { id: "geo-pic-colosseum", file: "geo-pic-colosseum.png" },
];

const HISTORY_ASSETS: AssetDefinition[] = [
  { id: "hist-pic-parthenon", file: "hist-pic-parthenon.png" },
  { id: "hist-pic-great-pyramid", file: "hist-pic-great-pyramid.png" },
  { id: "hist-pic-stonehenge", file: "hist-pic-stonehenge.png" },
  { id: "hist-pic-terracotta-army", file: "hist-pic-terracotta-army.png" },
  { id: "hist-pic-colosseum", file: "hist-pic-colosseum.png" },
  { id: "hist-pic-berlin-wall", file: "hist-pic-berlin-wall.png" },
  { id: "hist-pic-telescopic-printing", file: "hist-pic-telescopic-printing.png" },
  { id: "hist-pic-moai", file: "hist-pic-moai.png" },
  { id: "hist-pic-sphinx", file: "hist-pic-sphinx.png" },
  { id: "hist-pic-forbidden-city", file: "hist-pic-forbidden-city.png" },
  { id: "hist-pic-rosseta-stone", file: "hist-pic-rosseta-stone.png" },
  { id: "hist-pic-normandy-beach", file: "hist-pic-normandy-beach.png" },
];

const CATEGORY_ASSETS: Record<PictureRoundCategory, AssetDefinition[]> = {
  "general-knowledge": GENERAL_KNOWLEDGE_ASSETS,
  science: SCIENCE_ASSETS,
  geography: GEOGRAPHY_ASSETS,
  history: HISTORY_ASSETS,
};

const REGISTRY_ENTRIES: PictureRoundAsset[] = Object.entries(CATEGORY_ASSETS).flatMap(
  ([category, assets]) =>
    assets.map((asset) => ({
      id: asset.id,
      category: category as PictureRoundCategory,
      src: `/images/picture-round/${category}/${asset.file}`,
    })),
);

const FALLBACK_ASSET: PictureRoundAsset = {
  id: "fallback",
  category: "general-knowledge",
  src: "/images/picture-round/general-knowledge/1.svg",
};

const ASSET_MAP = new Map<string, PictureRoundAsset>();
const warnedMissingIds = new Set<string>();

function validateRegistry(): void {
  const seenIds = new Set<string>();
  const duplicates: string[] = [];

  for (const entry of REGISTRY_ENTRIES) {
    if (seenIds.has(entry.id)) {
      duplicates.push(entry.id);
      continue;
    }
    seenIds.add(entry.id);
    ASSET_MAP.set(entry.id, entry);
  }

  if (duplicates.length > 0) {
    logError(new Error("Duplicate picture-round image ids"), { duplicates });
  }
}

validateRegistry();

export function resolvePictureRoundImageId(
  categoryId: string,
  idSuffix: string,
): string {
  if (categoryId === "science") {
    const mapped = SCIENCE_PICTURE_QUESTION_IMAGE_MAP[idSuffix];
    if (mapped) return mapped;
  }

  const prefix = CATEGORY_IMAGE_PREFIX[categoryId] ?? categoryId;
  return `${prefix}-${idSuffix}`;
}

export function getPictureRoundAsset(imageId: string): PictureRoundAsset {
  const asset = ASSET_MAP.get(imageId);
  if (asset) return asset;

  if (!warnedMissingIds.has(imageId)) {
    warnedMissingIds.add(imageId);
    logWarning("Missing picture-round asset id", { imageId });
  }
  return FALLBACK_ASSET;
}

/** Resolve the public image path for any registered picture-round asset id. */
export function getPictureRoundAssetSrc(imageId: string): string {
  return getPictureRoundAsset(imageId).src;
}

export function validatePictureRoundImageIds(imageIds: string[]): {
  missing: string[];
  duplicateImageIds: string[];
} {
  const seen = new Set<string>();
  const duplicateImageIds: string[] = [];
  const missing: string[] = [];

  for (const imageId of imageIds) {
    if (seen.has(imageId)) {
      duplicateImageIds.push(imageId);
    } else {
      seen.add(imageId);
    }
    if (!ASSET_MAP.has(imageId)) {
      missing.push(imageId);
    }
  }

  return { missing, duplicateImageIds };
}

export const PICTURE_ROUND_ASSETS = REGISTRY_ENTRIES;

export const SCIENCE_PICTURE_ROUND_EXPECTED_FILES = SCIENCE_ASSETS.map((asset) => asset.file);
