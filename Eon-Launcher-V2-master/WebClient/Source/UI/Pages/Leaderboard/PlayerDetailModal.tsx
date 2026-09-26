import { createPortal } from "react-dom";
import { PlayClick } from "../../../Core/Services/SoundEffects";
import { LeaderStats } from "../../../Core/Configuration/LeaderboardStats";
import type { LeaderEntry } from "../../../Types/Leaderboard";

interface PlayerDetailModalProps {
  Entry: LeaderEntry;
  Image?: string;
  OnClose: () => void;
}

// Fields already shown elsewhere in this modal (avatar/name/level header, or
// the three known stat tiles) or that are pure bookkeeping - never listed
// again in the "Other stats" section below.
const KnownKeys = new Set(["Username", "Level", "AthenaCharacter", "Rank", "Kills", "Victory", "Points"]);

function FormatLabel(Key: string): string {
  const Spaced = Key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  return Spaced.replace(/\w\S*/g, (Word) => Word.charAt(0).toUpperCase() + Word.slice(1));
}

function FormatValue(Value: unknown): string {
  if (Value === null || Value === undefined || Value === "") return "-";
  if (typeof Value === "number") return Value.toLocaleString();
  if (typeof Value === "boolean") return Value ? "Yes" : "No";
  if (typeof Value === "object") return JSON.stringify(Value);
  return String(Value);
}

export function PlayerDetailModal({ Entry, Image, OnClose }: PlayerDetailModalProps) {
  const ExtraFields = Object.entries(Entry).filter(([Key]) => !KnownKeys.has(Key));

  return createPortal(
    <div className="logout-modal-backdrop" role="presentation" onMouseDown={OnClose}>
      <section
        className="logout-modal player-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-detail-title"
        onMouseDown={(Event) => Event.stopPropagation()}
      >
        <div className="player-detail-header">
          {Image ? (
            <img className="player-detail-avatar" src={Image} alt="" />
          ) : (
            <div className="player-detail-avatar player-detail-avatar-fallback">{Entry.Username.charAt(0).toUpperCase()}</div>
          )}
          <div>
            <h2 id="player-detail-title">{Entry.Username}</h2>
            <span className="player-detail-sub">Level {Entry.Level}{Entry.Rank ? ` · Rank #${Entry.Rank}` : ""}</span>
          </div>
        </div>

        <div className="player-detail-stats">
          {LeaderStats.map((Stat) => (
            <div key={Stat.Key} className="player-detail-stat">
              <img src={Stat.Icon} alt="" />
              <span className="player-detail-stat-value">{Entry[Stat.Key].toLocaleString()}</span>
              <span className="player-detail-stat-label">{Stat.Label}</span>
            </div>
          ))}
        </div>

        {ExtraFields.length > 0 && (
          <div className="player-detail-extra">
            <h3>Other stats</h3>
            <div className="player-detail-extra-grid">
              {ExtraFields.map(([Key, Value]) => (
                <div key={Key} className="player-detail-extra-row">
                  <span className="player-detail-extra-label">{FormatLabel(Key)}</span>
                  <span className="player-detail-extra-value">{FormatValue(Value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="logout-modal-actions">
          <button className="secondary" onClick={() => { PlayClick(); OnClose(); }}>Close</button>
        </div>
      </section>
    </div>,
    document.body,
  );
}