// SPA
  // Google Crowler indexation not realizes 
  // the search of this page because this page is rendering 
  // by the client side only. Every code is rendered by the javascript. No static code

  /*
  import { useEffect } from "react"

  export default function Home() {
    useEffect(() => {
      fetch('http://localhost:3333/episodes')
        .then(response => response.json())
        .then(data => console.log(data))
      }, [])
``*/

// SSR
  // In any pages of PagesManifestPlugin, a function called getServerSideProps() 
  // have to be exported as DefaultDeserializer. So Nextjs will know it must load 
  // the content before the user make the accessrequisition.
  // Execute everytime someone access the application.
  /*
  export default function Home(props) {

  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

export async function getServerSideProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    }
  }

}
*/





// SSG 
  //static version for the pages, more performance. JUST in production!
  /*
  export default function Home(props) {

  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 *8, //each 8 hours, a new api call will be fetchedwhen a new person access the page! 3 times a day.
  }

}

  */



// console.log Terminal-> server side nodejs server
// console.log Browser-> client side


export default function Home(props) {

  return (
    <div>
      <h1>Index</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

export async function getStaticProps() {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 *8, //each 8 hours, a new api call will be fetchedwhen a new person access the page! 3 times a day.
  }

}