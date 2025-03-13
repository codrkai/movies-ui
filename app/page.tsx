'use client';

import Nav from "@/components/nav";
import TMDBMovies from "@/components/tmdbMovies";
import { useState } from "react";

export default function MoviesAPI() {
    const [movieVal, setMovieVal] = useState<number>(0);

    return (
        <>
            <Nav
                value={0}
                onChange={(value: number) => setMovieVal(value)}
            />

            <TMDBMovies
                movieTypeValue={movieVal}
            />
        </>
    );
}
