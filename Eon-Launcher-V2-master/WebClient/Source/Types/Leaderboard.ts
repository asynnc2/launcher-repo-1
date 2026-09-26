export interface LeaderEntry {
  Username: string;
  Kills: number;
  Victory: number;
  Level: number;
  Points: number;
  AthenaCharacter?: { CosmeticId: string };
  Rank?: number;
  // The backend may return additional fields beyond the ones above that the
  // UI doesn't explicitly know about yet - this keeps them typed as
  // `unknown` (rather than dropped) so PlayerDetailModal can surface
  // whatever actually comes back at runtime.
  [Key: string]: unknown;
}

export type LeaderboardFilter = "points" | "kills" | "wins";

export interface LeaderStat {
  Key: "Kills" | "Victory" | "Points";
  Label: string;
  Icon: string;
  Filter: LeaderboardFilter;
}

export interface LeaderRowProps {
  Entry: LeaderEntry;
  Image?: string;
  IsPending: boolean;
  IsSearch: boolean;
  OnOpen?: (Entry: LeaderEntry) => void;
}