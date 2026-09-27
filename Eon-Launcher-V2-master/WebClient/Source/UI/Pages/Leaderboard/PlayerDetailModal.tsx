import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import { PlayClick } from "../../../Core/Services/SoundEffects";
import { LeaderStats, RankAccent } from "../../../Core/Configuration/LeaderboardStats";
import type { LeaderEntry } from "../../../Types/Leaderboard";

interface PlayerDetailModalProps {
  Entry: LeaderEntry;
  Image?: string;
  OnClose: () => void;
}

// Crown icon slightly tiled gotta fix that
function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 8.5l4 2.8L12 4l5 7.3 4-2.8-1.6 9.8H4.6L3 8.5z" />
      <rect x="4.6" y="18.3" width="14.8" height="2.1" rx="1" />
    </svg>
  );
}

//Stats displayed for player acc
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

  const HasRank = Boolean(Entry.Rank);
  const IsTop = HasRank && (Entry.Rank ?? 0) <= 3;
  const Accent = IsTop ? ({ "--rank": RankAccent[(Entry.Rank ?? 1) - 1] } as CSSProperties) : undefined;

  return createPortal(
    <div
      className={`logout-modal-backdrop player-detail-backdrop${IsTop ? " top" : ""}`}
      style={Accent}
      role="presentation"
      onMouseDown={OnClose}
    >
      <section
        className={`logout-modal player-detail-modal${IsTop ? " top" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="player-detail-title"
        onMouseDown={(Event) => Event.stopPropagation()}
      >
        <div className="player-detail-header">
          <div className={`player-detail-avatar-wrap${IsTop ? " top" : ""}`}>
            {IsTop && <CrownIcon className="player-detail-crown" />}
            {Image ? (
              <img className="player-detail-avatar" src={Image} alt="" />
            ) : (
              <div className="player-detail-avatar player-detail-avatar-fallback">{Entry.Username.charAt(0).toUpperCase()}</div>
            )}
          </div>
          <div className="player-detail-title">
            <h2 id="player-detail-title">{Entry.Username}</h2>
            <span className="player-detail-sub">Level {Entry.Level}{Entry.Rank ? ` · Rank #${Entry.Rank}` : ""}</span>
          </div>
          {HasRank && (
            <div className={`player-detail-medal${IsTop ? " top" : ""}`} aria-label={`Rank ${Entry.Rank}`}>
              #{Entry.Rank}
            </div>
          )}
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
          <button className={`secondary player-detail-close${IsTop ? " top" : ""}`} onClick={() => { PlayClick(); OnClose(); }}>Close</button>
        </div>
      </section>
    </div>,
    document.body,
  );
}