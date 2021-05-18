import { GetStaticProps } from 'next';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import Image from 'next/image'; // Manage with jpg and pngs in Next!
import Head from "next/head";
import Link from 'next/link';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR'

import styles from './home.module.scss';
import { PlayerContext, usePlayer } from '../contexts/PlayerContext';
// type or interface is the same
type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  duration: number;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

type HomeProps = { 
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer()

  // Inside React ->Imutability Paradigma
  // When use a information inside React, the ideal is to copy  the anterior info
  // and create a new one, rather than update the information. Performance stuffs  
  const episodeList = [...latestEpisodes, ...allEpisodes] 



// FORMAT THE DATA BEFORE THA DATA ARRIVED IN COMPONENT TO DISCOURAGE THE RENDERING EVERYTIME. Fotmat data very after the api response
  return (
    <div className={styles.homePage}> 
      <Head>
        <title>Home | Podcastr</title>
      </Head>

      <section className={styles.latestEpisodes}>
        <h2>Last Releases</h2>

        <ul>
          {/* map execute something and return it. Foreach just runs and not returns anything */}
          {/* Doing a map to an html return, MUST HAVE AN UNIQUE KEY IN THE FIRST ELEMENT! */}
          {/* List with som many items, is so hard to manage the items to revove from the screen. --> PERFORMANCE! */}
          {latestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image 
                width={192} 
                height={192} 
                src={episode.thumbnail} 
                alt={episode.title}
                objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                {/* Functions that need parameters, we need to pass not just the name, but () => play(episode) */}
                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Play the episode" />
                </button>

              </li>
            )
          })}
        </ul>

      </section>

      <section className={styles.allEpisodes}>
          <h2>All Episodes</h2>

          <table cellSpacing={0}>
            <thead>
              <tr>
                <th></th>
                <th>Podcast</th>
                <th>Members</th>
                <th>Date</th>
                <th>Duration</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {allEpisodes.map((episode, index) => {
                return (
                  <tr key={episode.id}>
                    <td style={{ width: 72 }}>
                      <Image 
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                      />
                    </td>
                    <td>
                      <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                      </Link> 
                    </td>
                    <td>{episode.members}</td>
                    <td style={{ width: 100 }}>{episode.publishedAt}</td>
                    <td>{episode.durationAsString}</td>
                    <td>
                      <button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
                        <img src="/play-green.svg" alt="Play episode" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        
      </section>
    </div>
  )
}


export const getStaticProps: GetStaticProps = async () => {

  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      url: episode.file.url
    }
  })


  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 *8, //each 8 hours, a new api call will be fetchedwhen a new person access the page! 3 times a day.
  }
}