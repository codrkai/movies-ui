'use server';

export const getListings = async (movie:string, id:number) => {
  const apiKey = process.env.TMDB_API;
  let movieUrl = null;

  switch(movie) {
      case "nowplaying":
        movieUrl = `${process.env.TMDB_URL}movie/now_playing`;
        break;

      case "upcoming":
        movieUrl = `${process.env.TMDB_URL}movie/upcoming`;
        break;

      case "popular":
        movieUrl = `${process.env.TMDB_URL}movie/popular`;
        break;

      case "trailers":
        movieUrl = `${process.env.TMDB_URL}movie/${id}/videos`;
        break;
      
      case "details":
        // https://api.themoviedb.org/3/movie/1034541?language=en-US&api_key=
        movieUrl = `${process.env.TMDB_URL}movie/${id}`
        break;
      
      default:
        throw new Error('Invalid request.');
  }

  const res = await fetch(`${movieUrl}?api_key=${apiKey}`);

  if (!res.ok) {
    throw new Error('Failed to fetch movies');
  }

  const data = await res.json();
  
  return data;

  //return data.results as Movie[];
}
