
import axios from 'axios'
import IItem from '../models/IItem';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const getMoviesComing = async ()=>{
    const response = await axios.get(`${baseUrl}/movies-coming`)
    return response.data;
}

const getMoviesInTheatres = async () =>{
    const repsone = await axios.get(`${baseUrl}/movies-in-theaters`)
    return repsone.data;
}

const getTopRatedIndia = async () =>{
    const repsone = await axios.get(`${baseUrl}/top-rated-india`)
    return repsone.data
}
const getTopRatedMovies = async () =>{
    const repsone = await axios.get(`${baseUrl}/top-rated-movies`)
    return repsone.data
}

const getFavorites = async () =>{
    const repsone = await axios.get(`${baseUrl}/favourite`)
    return repsone.data
}


const postFavourites = async (movie:Omit<IItem,'id'>)=>{
    const response = await axios.post<IItem>(`${baseUrl}/favourite`, movie,{
        headers:{
            "content-type" : "application/json"
        }
    })
    return response.data
}

export{
    getMoviesComing,
    getMoviesInTheatres,
    getTopRatedIndia,
    getTopRatedMovies,
    getFavorites,
    postFavourites
}
