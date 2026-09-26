import type { PageId } from "../../../Core/Configuration/PageDefinitions";
import { ShoppingCart } from "lucide-react";
import { UseDots } from "../../../Core/Hooks/UseDots";
import { PlayGlyph, SpinnerGlyph, StopGlyph, WindowsGlyph } from "../../Controls/Icons/PlayIcons";
import type { LaunchButton } from "../../../Core/Hooks/UseLaunchButton";

const Tags = ["Co-op", "Competitive", "Controller Support", "Multiplayer","Catboy Simulator"];
const HeroCopy = "Drop into the action you love or discover something new with your squad. Be the last player standing in Battle Royale.";

interface PlayProps {
  SelectedFolder: string;
  Downloading: boolean;
  Launch: LaunchButton;
  OnNavigate?: (Page: PageId) => void;
  IsGuest: boolean;
  OnRequireLogin: () => void;
}

export function PlayPage({ SelectedFolder, Downloading, Launch, OnNavigate, IsGuest, OnRequireLogin }: PlayProps) {
  const Busy = Launch.Launching && !Launch.Failed;
  const NoBuild = !SelectedFolder && !Launch.Failed;
  const Dots = UseDots(Busy);

  return (
    <div className="home-frame">
      <div className="hero-scene" data-tour="home-hero">
        <div className="hero-overlay hero-overlay-bottom">
          <div className="hero-footer-text">
            <span className="hero-release-label">Fortnite</span>
            <h2>{HeroCopy}</h2>
          </div>
          <div className="hero-tags" aria-label="Game categories">
            <WindowsGlyph />
            {Tags.map((Tag) => (
              <span key={Tag}>{Tag}</span>
            ))}
          </div>
          <div className="hero-footer-actions">
            {Launch.GameRunning ? (
              <button className="play-now-button hero-footer-play" disabled={Launch.Stopping} onClick={() => void Launch.Stop()}>
                <StopGlyph />
                {Launch.Stopping ? "Closing" : "Close"}
              </button>
            ) : (
              <button
                className={`play-now-button hero-footer-play${IsGuest ? " guest-locked" : ""}`}
                data-tour="play-button"
                disabled={!IsGuest && (Busy || Downloading || (!SelectedFolder && !Launch.Failed))}
                onClick={IsGuest ? OnRequireLogin : Launch.Launch}
              >
                {IsGuest ? null : Busy ? <SpinnerGlyph /> : NoBuild ? null : <PlayGlyph />}
                <span className="play-now-label">
                  {IsGuest ? "Login Required" : Launch.Label}
                  {!IsGuest && Busy && <span className="play-now-dots">{Dots}</span>}
                </span>
              </button>
            )}
            <button className="hero-icon-button" type="button" aria-label="Shop" onClick={() => OnNavigate?.("shop")}>
              <ShoppingCart size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}