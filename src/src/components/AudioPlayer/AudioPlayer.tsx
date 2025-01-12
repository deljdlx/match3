import React, { useRef, useImperativeHandle, forwardRef } from "react";

type AudioPlayerProps = {
  src: string;
  loop?: boolean;
};

export type AudioPlayerHandle = {
  play: () => void;
};

export const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(
  ({ src, loop }, ref) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    // Expose les méthodes au parent via `useImperativeHandle`
    useImperativeHandle(ref, () => ({
      play() {
        if (audioRef.current) {
          audioRef.current.play().catch((error) => {
            console.error("Autoplay bloqué : ", error);
          });
        }
      },
    }));

    return (
      <audio ref={audioRef} controls loop={loop || false}>
        <source src={src} type="audio/mpeg" />
      </audio>
    );
  }
);
