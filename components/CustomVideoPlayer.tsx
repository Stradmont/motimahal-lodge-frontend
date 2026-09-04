'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';

interface CustomVideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
}

export default function CustomVideoPlayer({
  src,
  poster,
  className = '',
  autoPlay = true,
  muted = false,
}: CustomVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const enableAudio = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    setIsMuted(false);
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (autoPlay) {
      // Attempt unmuted play first
      video.muted = false;
      setIsMuted(false);

      video
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // If browser blocks unmuted autoplay, fallback to muted autoplay
          video.muted = true;
          setIsMuted(true);
          video
            .play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch(() => {
              setIsPlaying(false);
            });

          // Enable audio on first user interaction anywhere on the page
          const handleUserInteraction = () => {
            if (videoRef.current) {
              videoRef.current.muted = false;
              setIsMuted(false);
            }
          };

          window.addEventListener('click', handleUserInteraction, { once: true });
          window.addEventListener('touchstart', handleUserInteraction, { once: true });
          window.addEventListener('keydown', handleUserInteraction, { once: true });
        });
    }
  }, [autoPlay]);

  const handleContainerClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      // Unmute audio immediately on video container click instead of pausing
      enableAudio();
    } else {
      // Toggle play/pause if audio is already active
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const newMutedState = !video.muted;
    video.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    setCurrentTime(video.currentTime);
    if (video.duration) {
      setProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;

    setDuration(video.duration);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * video.duration;

    video.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress((newTime / video.duration) * 100);
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch((err) => console.error(err));
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div
      ref={containerRef}
      className={`relative group overflow-hidden bg-black rounded-lg border border-brand-border ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={handleContainerClick}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted={isMuted}
        loop
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Prominent "Tap for sound" overlay badge when muted */}
      {isMuted && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            enableAudio();
          }}
          aria-label="Tap to turn on sound"
          className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3.5 py-2 rounded-full bg-brand-gold text-brand-dark font-semibold text-xs sm:text-sm shadow-xl hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer animate-pulse"
        >
          <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Tap for sound</span>
        </button>
      )}

      {/* Floating Centered Overlay Play/Pause Button */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
          !isPlaying || showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (isMuted) {
              enableAudio();
            } else {
              const video = videoRef.current;
              if (!video) return;
              if (video.paused) {
                video.play();
                setIsPlaying(true);
              } else {
                video.pause();
                setIsPlaying(false);
              }
            }
          }}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
          className="pointer-events-auto p-4 sm:p-5 rounded-full bg-black/50 text-white hover:bg-brand-green border border-white/20 shadow-lg backdrop-blur-md transform transition-all duration-300 hover:scale-110 cursor-pointer"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6 sm:h-8 sm:w-8 fill-current" />
          ) : (
            <Play className="h-6 w-6 sm:h-8 sm:w-8 fill-current ml-0.5" />
          )}
        </button>
      </div>

      {/* Bottom Control Bar Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 flex flex-col space-y-2 pointer-events-auto ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div
          className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer overflow-hidden relative group/bar"
          onClick={handleSeek}
        >
          <div
            className="h-full bg-brand-gold rounded-full transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls Bar Row */}
        <div className="flex items-center justify-between text-white text-xs sm:text-sm pt-1">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                const video = videoRef.current;
                if (!video) return;
                if (video.paused) {
                  video.play();
                  setIsPlaying(true);
                } else {
                  video.pause();
                  setIsPlaying(false);
                }
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="hover:text-brand-gold transition-colors cursor-pointer"
            >
              {isPlaying ? <Pause className="h-4 w-4 sm:h-5 sm:w-5" /> : <Play className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>

            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className="hover:text-brand-gold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              {isMuted ? (
                <>
                  <VolumeX className="h-4 w-4 sm:h-5 sm:w-5 text-brand-gold" />
                  <span className="text-brand-gold font-medium text-xs hidden sm:inline">Unmute</span>
                </>
              ) : (
                <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </button>

            <span className="font-mono text-[11px] sm:text-xs text-white/80">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label="Fullscreen"
              className="hover:text-brand-gold transition-colors cursor-pointer"
            >
              <Maximize className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

