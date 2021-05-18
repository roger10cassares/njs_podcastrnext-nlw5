# njs_podcastrnext-nlw5



tree

```bash
.next/
node_modules/
public/
├── arrow-left.svg
├── favicon.png
├── logo.svg
├── pause.svg
├── play-green.svg
├── playing.svg
├── play-next.svg
├── play-previous.svg
├── play.svg
├── repeat.svg
└── shuffle.svg/
src/
├── components/
│   ├── Header/
│   │   ├── index.tsx
│   │   └── styles.module.scss
│   └── Player/
│       ├── index.tsx
│       └── styles.module.scss
├── contexts/
│   └── PlayerContext.tsx
├── pages/
│   ├── _app.tsx
│   ├── _document.tsx
│   ├── episodes/
│   │   ├── episode.module.scss
│   │   └── [slug].tsx
│   ├── home.module.scss
│   └── index.tsx
├── services/
│   └── api.ts
├── styles/
│   ├── app.module.scss
│   └── global.scss
└── utils/
    └── convertDurationToTimeString.ts
.gitignore
next-env.d.ts
next.config
package.json
README.md
tsconfig.json
yarn.lock
```



# Init

In a `create-next-app`, the first thing that shall be read when an access is trigger from the client-side at the browser is the `src/_app.tsx` file. The `_app.tsx` is the component that shall the default App Component Design for every pages at the App. Here is the place to import the `styles/global.scss` also, which defines the default styles to all the App. The `_document.tsx` file is the responsible for configure the default document properties.



# src/pages/index.tsx

the `src/pages/index.tsx` is a Typescripted page that will be the first page that loads in the client-side browser access at `/`.

In this Typescript code, the Nextjs allows to render somethings before the page really mount at the DOM. GetStaticProps and GetServerSideProps are some of Props that Nextjs renders before the main componebt of the page is mounted.

The import of this props are realized with `import { GetStaticProps } from 'next';` and `import { GetStaticProps } from 'next';` imports commands.

Using Typescript, these Props can be done as follows. 

- Example for the `GetStaticProps`(SSG):

```typescript
// Executed on BUILD TIME! Revalidate optional from defined time to time

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
    revalidate: 60 * 60 *8, //each 8 hours, a new api call will be fetched 
                            // when a new person access the page! 3 times a day.
  }
}
```



- Example for the `GetServerSideProps`(SSR):

```typescript
// In any pages of PagesManifestPlugin, a function called getServerSideProps() 
// have to be exported as DefaultDeserializer. So Nextjs will know it must load 
// the content before the user make the accessrequisition.
// Execute everytime someone access the application.

// Executed on EVERY REQUEST!

export const getStaticProps: GetServerSideProps = async () => {

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
    revalidate: 60 * 60 *8, //each 8 hours, a new api call will be fetched 
                            // when a new person access the page! 3 times a day.
  }
}
```



- Example for the `Single Page Application` (SPA):

```typescript
// Google Crowler indexation not realizes 
// the search of this page because this page is rendering 
// by the client side only. Every code is rendered by the javascript. No static code

// Executed on EVERY REQUEST!

import { useEffect } from "react"

export default function Home() {
    useEffect(() => {
        fetch('http://localhost:3333/episodes')
            .then(response => response.json())
            .then(data => console.log(data))
    }, [])
```



> *Note: All `console.log()` executed in Terminal, is realized from the Nodejs server, i.e., Server Side. However, all `console.log()` realized at the Console's Inspection Tool at the Browser are from the Client-Side operations.*



Take the example of `GetStaticProps`, the function, returns a props object from this page with an optional revalidation time. Each moment the revalidation time is achieved, the first client to access this page will serve to render this props at the request time and it will be build to all the others requests within this period.

Considering the returned props is and object of two arrays, `latestEpisodes[]` and `allEpisodes[]`, this shall be called as `HomeProps` typo. Besides, each index of `latestEpisodes[]` and `allEpisodes[]` array has an object with `id,` `title`, `thumbnail`, `members`, `duration`, `durationAsString`, `url` and `publishedAt` items.

So, at first, the typo of the object items shall be declared as follows:

```typescript
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
```

Then, as the props object items are arrays, it shall be declared as bellow:

```typescript
type HomeProps = { 
  // episodes: Array<Episode> // sama as bellow
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}
```

These declarations means that the props objects elements `latestEpisodes` and `allEpisodes` are an array typo from the `episode` object.

After declaring these typos, it can be passed as props to the Functional Component from this page.

> *Note, the GetStaticProps and the GetServerSideProps are only allowed to pass props to a Page's Functional/Class Component in the same file.*



The default format from ES6 to generate a Functional Component is the Typescript using React is demonstrated bellow:

```typescript
const export Home = ({ latestEpisodes, allEpisodes }: HomeProps) => {
  return <div></div>
}
```

> *Note: As the `latestEpisodes`, `allEpisodes` typos was declared before, it should not be declared again inside the parameters of the Functional Component*





# src/pages/episodes/[slug].tsx



The brackets `[ ]` in the name of the file indicates that this pages should be dynamically generated using Dynamic Path Routing.

As the path from src directory is src/pages/episodes and at the src/pages/index.tsx should be the http://localhost:3000 endpoint, this new path with episodes attached may be served at http://localhost:3000/episodes/ endpoint. Varying the page parameter of the episode, it can be accessed from the http://localhost:3000/episodes/{episode.parameter} endpoint.

















FInalized

yarn add typescript @types/react @types/node -D 
-D dev dependency

yarn add sass

yarn add date-fns

yarn add json-server -D
package.json -> create script named "server"


yarn add axios

yarn add rc-slider


Melhorias: 
Responsivo, lidar com tabelas
PWA, rodar ofline, app -> Next PWA
Tema Dark, OMni, por exemplo
Electron. App Desktop









