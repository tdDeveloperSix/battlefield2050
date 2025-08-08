import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, Volume2, VolumeX, RotateCcw, FastForward } from 'lucide-react';

const PodcastPlayer: React.FC = () => {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [previousVolume, setPreviousVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

    // Init volume/mute fra element (iOS kan starte lavere)
    setVolume(audio.volume);
    setIsMuted(audio.muted || audio.volume === 0);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleSeek = (newTime: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.max(0, Math.min(duration || 0, newTime));
    audio.currentTime = clamped;
    setCurrentTime(clamped);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSeek(parseFloat(e.target.value));
  };

  const handleSeekInput = (e: React.FormEvent<HTMLInputElement>) => {
    handleSeek(parseFloat((e.target as HTMLInputElement).value));
  };

  const handleVolume = (newVolume: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const vol = Math.max(0, Math.min(1, newVolume));
    audio.volume = vol;
    setVolume(vol);
    if (vol === 0) {
      audio.muted = true;
      setIsMuted(true);
    } else {
      if (isMuted) audio.muted = false;
      setIsMuted(false);
      setPreviousVolume(vol);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleVolume(parseFloat(e.target.value));
  };

  const handleVolumeInput = (e: React.FormEvent<HTMLInputElement>) => {
    handleVolume(parseFloat((e.target as HTMLInputElement).value));
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted || audio.muted || audio.volume === 0) {
      // Unmute til previousVolume (fallback 0.5)
      const restore = previousVolume > 0 ? previousVolume : 0.5;
      audio.muted = false;
      audio.volume = restore;
      setVolume(restore);
      setIsMuted(false);
    } else {
      setPreviousVolume(volume);
      audio.muted = true;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    handleSeek(audio.currentTime + seconds);
  };

  const pct = duration ? (currentTime / duration) * 100 : 0;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 sm:p-8 mb-8">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          {t('podcast.title')}
        </h3>
      </div>
      
      <p className="text-slate-300 mb-6 leading-relaxed">
        {t('podcast.description')}
      </p>

      <audio
        ref={audioRef}
        src="https://mcdn.podbean.com/mf/web/sx32mfva5mewwxhx/AI_Battlefield_Transformation9nwsd.mp3"
        preload="metadata"
        playsInline
      />

      <div className="bg-slate-900/50 rounded-lg p-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-slate-400 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeekChange}
            onInput={handleSeekInput}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${pct}%, #374151 ${pct}%, #374151 100%)`
            }}
            aria-label="Søg i afspilning"
          />
        </div>
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Skip Back */}
            <button
              onClick={() => skip(-10)}
              className="p-2 text-slate-400 hover:text-white transition-colors focus:outline-none"
              title="Skip back 10s"
              aria-label="Skip back 10 seconds"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white p-3 rounded-full transition-colors flex items-center justify-center focus:outline-none"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </button>
            {/* Skip Forward */}
            <button
              onClick={() => skip(30)}
              className="p-2 text-slate-400 hover:text-white transition-colors focus:outline-none"
              title="Skip forward 30s"
              aria-label="Skip forward 30 seconds"
            >
              <FastForward className="w-5 h-5" />
            </button>
          </div>
          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="p-2 text-slate-400 hover:text-white transition-colors focus:outline-none"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              onInput={handleVolumeInput}
              className="w-20 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
              }}
              aria-label="Lydstyrke"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastPlayer; 