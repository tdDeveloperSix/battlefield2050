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
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);

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

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = Math.max(0, Math.min(duration, audio.currentTime + seconds));
  };

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
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
            }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Skip Back */}
            <button
              onClick={() => skip(-10)}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Skip back 10s"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white p-3 rounded-full transition-colors flex items-center justify-center"
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
              className="p-2 text-slate-400 hover:text-white transition-colors"
              title="Skip forward 30s"
            >
              <FastForward className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-20 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(isMuted ? 0 : volume) * 100}%, #374151 ${(isMuted ? 0 : volume) * 100}%, #374151 100%)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastPlayer; 