import { NextRequest } from "next/server";

type paramsProp = {
    params: {
        movie: string;
        id: number;
    },
};

export async function GET(req: NextRequest, {params}: paramsProp) {
    const {movie, id} = params;

    //const {movie, id} = req.query
    //const { searchParams } = new URL(req.url);
    //const movie = searchParams.get('movie');

    let movieUrl = null;

    switch(movie) {
        case "nowplaying":
            // https://api.themoviedb.org/3/movie/now_playing?api_key=
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
        
        default:
            break;
    }

    if (movieUrl) {
        console.log(`movie: ${movieUrl}`)
        const data = await fetch(`${movieUrl}?api_key=${process.env.TMDB_API}`)
        return new Response(JSON.stringify(data))
    }

    return new Response(null, { status: 200 })
}