import { createContext, useState, ReactNode } from 'react';

//ReacNode is a react type for anything in the jsx children

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
} 

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;

};

export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {

  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // const [isAuth]

  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function togglePlay(){
    setIsPlaying(!isPlaying);
  }

  function setPlayingState(state) {
    setIsPlaying(state);
  }

  // function sign() {

  // }

  return (
    // <AuthContext></AuthContext> 
    // children destructured pass all the conten that exists inside PlayerProviderTag
    <PlayerContext.Provider 
      value={{ 
        episodeList, 
        currentEpisodeIndex, 
        play, 
        isPlaying, 
        togglePlay, 
        setPlayingState 
      }}
    >
      {children} 
    </PlayerContext.Provider>
  )
}