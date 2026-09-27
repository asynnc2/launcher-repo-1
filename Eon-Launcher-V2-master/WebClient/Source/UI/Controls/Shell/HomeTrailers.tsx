import { useEffect, useRef } from "react";
import { TrailerSources } from "../../../Core/Configuration/Assets";

interface HomeTrailersProps {
  Visible: boolean;
  IsPlayPage: boolean;
  Active: number;
  OnEnded: (Index: number) => void;
}

export function HomeTrailers({ Visible, IsPlayPage, Active, OnEnded }: HomeTrailersProps) {
  const VideoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Only the currently visible trailer is actually decoded/played now -
    // previously every trailer had autoPlay set and all of them played
    // simultaneously in the background regardless of which one was shown.
    VideoRefs.current.forEach((Video, Index) => {
      if (!Video) return;

      if (IsPlayPage && Index === Active) {
        if (Video.paused) void Video.play().catch(() => {});
      } else {
        Video.pause();
      }
    });
  }, [Active, IsPlayPage]);

  if (!Visible) return null;

  return (
    <>
      {TrailerSources.map((Source, Index) => (
        <video
          key={Source}
          ref={(Element) => { VideoRefs.current[Index] = Element; }}
          id={`home-trailer-${Index}`}
          className={`home-trailer${IsPlayPage ? " is-ready" : ""}${IsPlayPage && Active === Index ? " is-active" : ""}`}
          muted
          loop={TrailerSources.length < 2}
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nofullscreen noremoteplayback noplaybackrate nodownload"
          preload={Index === Active ? "auto" : "none"}
          aria-hidden="true"
          onEnded={() => OnEnded(Index)}
        >
          <source src={Source} type="video/mp4" />
        </video>
      ))}
    </>
  );
}

interface TrailerIndicatorProps {
  Active: number;
  OnSelect: (Index: number) => void;
}

export function TrailerIndicator({ Active, OnSelect }: TrailerIndicatorProps) {
  return (
    <div className="hero-trailer-indicator" aria-label="Choose trailer">
      {TrailerSources.map((Source, Index) => (
        <button
          key={Source}
          type="button"
          className={Active === Index ? "is-active" : undefined}
          aria-label={`Play trailer ${Index + 1}`}
          aria-current={Active === Index ? "true" : undefined}
          onClick={() => OnSelect(Index)}
        />
      ))}
    </div>
  );
}