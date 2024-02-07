import React, { useState, useEffect, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';
function App() {
  const[movies,setMovies ] = useState([]);
  const[isLoading, setLoading] = useState(false);
  const[error, setError] = useState(null);

 
  const fetchMoviesHandler = useCallback(async ()=> {
   try {
    setLoading(true);
    setError(null);
    const responce = await fetch('https://ecomstore-http-default-rtdb.firebaseio.com/movies.json');
    if(!responce.ok) {
      throw new Error ("Something went wrong!");
    }
    const data = await responce.json();

    const loadedMovies = [];

    for(let key in data){
      loadedMovies.push({
        id:key,
        openingText:data[key].openingText,
        title:data[key].title,
        releaseDate:data[key].releaseDate
      })
    }

    setMovies(loadedMovies);
    
  }
  catch(error){
    setError(error.message)
    console.log('error')

  }
  
  },[])


  const addMovieHandler = async (movie) => {
    const responce = await fetch('https://ecomstore-http-default-rtdb.firebaseio.com/movies.json',{
      method:'POST',
      body:JSON.stringify(movie),
      headers:{
        'Content-Type':'application/json'
      }
    });
    const data = await responce.json();
    console.log(data)
  }

  const onDeleteHandler = async (id) => {
    const responce = await fetch(`https://ecomstore-http-default-rtdb.firebaseio.com/movies/${id}`,{
      method:'delete'
    })
    const data = await responce.json();
    console.log(data);
  }

  useEffect(()=> {
    fetchMoviesHandler()
  },[fetchMoviesHandler]) 


 
  let content = <p>no movies found</p>
  if(error) content = <p>{error}</p>
  if(isLoading) content = <p>Loading...</p>
  if(movies.length > 0) content = <MoviesList movies={movies} onDelete={onDeleteHandler}/>
  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
        </section><section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
       {content}
       {error && <button onClick={() => setLoading(false)}>cancel</button>}
      </section>
    </React.Fragment>
  );
}

export default App;