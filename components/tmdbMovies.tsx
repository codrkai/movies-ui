'use client';

import React, { useCallback } from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { getListings } from "@/lib/tmdb";

type TrailerProp = {
    site: string;
    type: string;
    name: string;
    key: string;
}

type MoviesProp = {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
}

type TMDBMoviesProps = {
    movieTypeValue: number;
}

export default function TMDBMovies({movieTypeValue}: TMDBMoviesProps) {
    const imgPathOriginal = `${process.env.NEXT_PUBLIC_TMDB_IMAGE_URL}original/`;
    const imgPath500 = `${process.env.NEXT_PUBLIC_TMDB_IMAGE_URL}w500/`;
    const youtubeEmbedLink = 'https://www.youtube.com/embed/';
    const [moviePoster, setMoviePoster] = useState('');
    const [pageTitle, setPageTitle] = useState('');
    const [trailerModal, setTrailerModal] = useState(false);
    const [trailerVideo, setTrailerVideo] = useState('');
    const detailsModal = useRef<HTMLDialogElement | null>(null);

    const movieType = useMemo(() => [
        {id: 0, title: 'Movies Now Playing in Theaters', type: 'nowplaying'},
        {id: 1, title: 'Movies Coming Soon To Theaters', type: 'upcoming'},
        {id: 2, title: 'Popular Movies Playing in Theaters', type: 'popular'},
    ], []);

    const [movies, setMovies] = useState<MoviesProp[]>([]);
    const [trailers, setTrailers] = useState<TrailerProp[]>([]);

    const [details, setDetails] = useState({
        id: 0,
        backdrop_path: '',
        homepage: '',
        original_language: '',
        overview: '',
        poster_path: '',
        release_date: '',
        runtime: 0,
        tagline: '',
        title: ''
    });

    const [activeMovie, setActiveMovie] = useState({
        id: 0,
        title: '',
        overview: '',
        poster_path: ''
    });

    const getMovies = useCallback(async (value: number) => {
        const data = await getListings(movieType[value].type, 0);

        if (data.results && data.results.length > 0) {
            setPageTitle(movieType[value].title);

            setMovies(data.results);

            setActiveMovie({
              id: data.results[0].id,
              title: data.results[0].title,
              overview: data.results[0].overview,
              poster_path: data.results[0].poster_path
            });
            
            const currentMoviePoster = imgPathOriginal + data.results[0].poster_path;

            setMoviePoster(currentMoviePoster);
        }
    }, [movieType, imgPathOriginal]);

    useEffect(() => {
        let isMounted = true;

        const fetchMovies = async () => {
            if (isMounted) {
                getMovies(movieTypeValue);
            }
        };

        fetchMovies();

        return () => {
            isMounted = false;
        };

    }, [movieTypeValue, movieType, getMovies]);
    
    const getTrailers = async (id: number) => {
        setTrailerVideo('');

        const data = await getListings('trailers', id);

        if (data.results && data.results.length > 0) {
            setTrailers(data.results);
            setTrailerVideo(`${youtubeEmbedLink}${data.results[0].key}`);
        }

        setTrailerModal(!trailerModal);
    };

    const handleActiveMovie = (id: number) => {
        const selectedMovie: MoviesProp = movies.filter((element: {id: number}) => element.id === id)[0];
        setActiveMovie(selectedMovie);
        const currentMoviePoster = imgPathOriginal + selectedMovie.poster_path;
        setMoviePoster(currentMoviePoster);
    };

    const getDetails = async (id: number) => {
        const data = await getListings('details', id);

        if (data) {
            setDetails({
                id: data.id,
                backdrop_path: data.backdrop_path,
                homepage: data.homepage,
                original_language: data.original_language,
                overview: data.overview,
                poster_path: data.poster_path,
                release_date: data.release_date,
                runtime: data.runtime,
                tagline: data.tagline,
                title: data.title
            });

            if (detailsModal.current) {
                detailsModal.current.showModal();
            }
        }
    };

    // scrollbars
    const scrollRef = useRef<HTMLDivElement>(null);
    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = direction === "left" ? -500 : 500;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <>
            <div className="max-w-screen-xl flex mx-auto text-gray-100">
                <div className="w-full h-full bg-black bg-cover bg-center transition-all transform ease-in-out delay-300 md:bg-auto" style={{'backgroundImage':`url(${moviePoster})`}}>

                    <div id="trailer-modal" className="absolute z-50 w-full h-full inset-0 bg-gray-900 bg-opacity-90 overflow-y-auto" style={trailerModal ? {visibility:'visible'} : {visibility:'hidden'}}>
                        <div className="relative mt-5 mx-auto p-5 border w-[900px] shadow-lg rounded-md bg-gray-100">
                        <div id="video-player" className="mt-3 border-gray-400">
                            {
                            trailerVideo &&
                                <iframe 
                                    width="854" 
                                    height="480" 
                                    src={trailerVideo} 
                                    allow="autoplay; encrypted-media" 
                                    allowFullScreen
                                ></iframe>
                            }
                        </div>
                        <div className="mt-10">
                            <h3 className="text-lg leading-6 font-medium text-gray-900 ml-7">Trailers</h3>
                            <div className="mt-2 px-7 py-3">
                            
                            <ul className="grid grid-cols-2 text-sm text-gray-500 gap-2">
                            {
                            trailers && 
                                trailers?.map( (item: TrailerProp) => {
                                    if (item.site === "YouTube") {
                                        return (
                                        <React.Fragment key={item.key}>
                                            <li className="hover:text-blue-500">
                                                <button onClick={() => setTrailerVideo(`${youtubeEmbedLink}${item.key}`)}>{item.name}</button>
                                            </li>
                                            <li>{item.type}</li>
                                        </React.Fragment>
                                        )
                                    }
                                })
                            }
                            </ul>

                            </div>
                            <div className="items-center px-4 py-3">
                            <button id="close-btn" onClick={() => setTrailerModal(!trailerModal)} className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                Close
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="h-[420px] p-4">
                        {
                        activeMovie.id > 0 &&
                            <div className="max-w-md mt-5">
                                <div className="flex font-bold text-5xl mb-2">{activeMovie.title}</div>
                                
                                <button
                                    className="inline-flex rounded shadow bg-gray-300 hover:bg-gray-200 text-black font-bold px-6 py-2 my-4 mr-4"  
                                    onClick={() => getTrailers(activeMovie.id)}
                                    >
                                        <svg className="bi bi-play-fill pt-1 text-5xl" xmlns="http://www.w3.org/2000/svg" width="20" height="18" fill="currentColor" viewBox="0 0 16 16"> <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/></svg>
                                        Play Trailer
                                </button>

                                <button
                                    className="inline-flex rounded shadow bg-gray-300 hover:bg-gray-200 text-black font-bold px-6 py-2 my-4 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-gray-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-gray-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]" 
                                    onClick={() => getDetails(activeMovie.id)}
                                    >
                                        + Details
                                </button>

                                <p className="py-2 px-4 text-base rounded-xl bg-black opacity-70">
                                    {activeMovie.overview}
                                </p>
                            </div>
                        }
                    </div>
                    
                    <div className="pl-4 mt-8 text-3xl">{pageTitle}</div>

                    <div className="relative">
                        {/* Left Scroll Button */}
                        <button
                            onClick={() => scroll("left")}
                            className="absolute left-0 top-1/2 h-64 transform -translate-y-1/2 z-10 p-2 bg-black border rounded-xl shadow opacity-50 hover:text-red-500 hover:opacity-90"
                            aria-label="Scroll Left"
                        >
                            &larr;
                        </button>

                        {/* Scrollable Container */}
                        <div ref={scrollRef} className="overflow-x-scroll scrollbar-hide">
                            <ul className="w-[4200px] h-[340px] p-4">
                            {
                            movies && 
                                movies?.map( (item: MoviesProp) => (
                                        <li className="inline-flex border-4 border-black hover:border-gray-300 hover:scale-105 transition ease-in" key={item.id}>
                                            <button onClick={() => handleActiveMovie(item.id)}>
                                                <Image src={`${imgPath500}${item.poster_path}`} width={200} height={75} alt={`${item.title}`} />
                                            </button>
                                        </li>
                                    )
                                )
                            }
                            </ul>
                        </div>

                        {/* Right Scroll Button */}
                        <button
                            onClick={() => scroll("right")}
                            className="absolute right-0 top-1/2 h-64 transform -translate-y-1/2 z-10 p-2 bg-black border rounded-full shadow opacity-50 hover:text-red-500 hover:opacity-90"
                            aria-label="Scroll Right"
                        >
                            &rarr;
                        </button>
                    </div>

                </div>
            </div>

            <dialog id="details_modal" className="modal">
                <div className="modal-box flex flex-col max-w-4xl h-2/3 bg-black border-gray-400 border-2">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    
                    {
                        details.id > 0 && 
                        <>
                            <div className="card lg:card-side bg-base-100 shadow-xl items-center">
                                <Image src={`${imgPath500}${details.poster_path}`} width={300} height={75} alt={`${details.title}`} />
                                <div className="card-body">
                                    <h2 className="card-title text-left">{details.title}</h2>
                                    <p className="italic text-left">{details.tagline}</p>
                                    <p className="text-left">{details.overview}</p>

                                    <div className="flex gap-4">
                                        <span className="rounded-2xl p-2 italic bg-gray-800 text-sm">language: {details.original_language}</span>
                                        <span className="rounded-2xl p-2 italic bg-gray-800 text-sm">released: {details.release_date}</span>
                                        <span className="rounded-2xl p-2 italic bg-gray-800 text-sm">runtime: {details.runtime} min</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    }

                    <p className="py-4">Press ESC key or click on ✕ button to close</p>
                </div>
            </dialog>
        </>
    );
}