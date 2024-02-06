import React, { useState } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const[movies,setMovies ] = useState([]);
  const[isLoading, setLoading] = useState(false);
  const[error, setError] = useState(null);
  let timeOutId;

  async function fetchMoviesHandler () {
   try {
    setLoading(true);
    setError(null);
    const responce = await fetch('https://swapi.dev/api/film/');
    if(!responce.ok) {
      throw new Error ("Something went wrong!");
    }
    const data = await responce.json();

    const transformedMovies = data.results.map(movieData => {
      return {
        id:movieData.episode_id,
        title:movieData.title,
        openingText:movieData.opening_crawl,
        releaseDate:movieData.release_date
      }
    })
    setMovies(transformedMovies);
    
  }
  catch(error){
    setError(error.message)
    console.log('error')
    timeOutId = setTimeout(fetchMoviesHandler,5000);

  }
  
  }

  let content = <p>no movies found</p>
  if(movies.length > 0) content = <MoviesList movies={movies} />
  if(error) content = <p>{error}</p>
  if(isLoading) content = <p>Loading...</p>
  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
       {content}
       {error && <button onClick={() => clearInterval(timeOutId)}>cancel</button>}
      </section>
    </React.Fragment>
  );
}

export default App;