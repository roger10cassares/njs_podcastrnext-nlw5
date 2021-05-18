
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { PlayerContext, usePlayer } from '../../contexts/PlayerContext';
import Slider from 'rc-slider';

import styles from './styles.module.scss';
import 'rc-slider/assets/index.css';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';


export function Player() {
    //audio element just created in the screen when the file is playes
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0)

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        clearPLayerState
    } = usePlayer();

    useEffect(() => {
        if (!audioRef.current) {  //current is the value of the reference html
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying])

    function setupProgressLIstener() {
        audioRef.current.currentTime = 0;

        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount: number) {
      audioRef.current.currentTime = amount;
      setProgress(amount)
    }

    function handleEpisodeEnded() {
      if (hasNext) {
        playNext()
      } else {
        clearPLayerState()
      }
    }

    const episode = episodeList[currentEpisodeIndex]

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Playng now" />
                <strong> Playing now</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <Image 
                        width={592} 
                        height={592} 
                        src={episode.thumbnail} 
                        objectFit="cover" 
                    />
                <strong>{episode.title}</strong>
                <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Select a podcast to listen</strong>
                </div>
            ) }

            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationToTimeString(progress)}</span>

                    <div className={styles.slider}>
                        { episode ? (
                            <Slider 
                              max={episode.duration}
                              value={progress}
                              onChange={handleSeek}
                              trackStyle={{ backgroundColor: '#04d361'}}
                              railStyle={{ backgroundColor: '#9f75ff'}}
                              handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        ) }
                    </div>

                    <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                { episode && (
                    <audio 
                        src={episode.url}
                        ref={audioRef} //every HTML element receive the ref tag 
                        loop={isLooping}
                        autoPlay
                        onEnded={handleEpisodeEnded}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressLIstener}
                    />
                )}

                <div className={styles.buttons}>
                    <button 
                        type="button" 
                        disabled={!episode || episodeList.length === 1}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Shuffle" />
                    </button>

                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Play previews" />
                    </button>

                    <button
                        type="button" 
                        className={styles.playButton} 
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                        { isPlaying 
                            ? <img src="/pause.svg" alt="Pause" />
                            : <img src="/play.svg" alt="Play" />
                        }
                    </button>

                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Play next" />
                    </button>

                    <button 
                        type="button" 
                        disabled={!episode}
                        onClick={toggleLoop}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="Repeat" />
                    </button>
                </div>
            </footer>
        </div>
    );
}