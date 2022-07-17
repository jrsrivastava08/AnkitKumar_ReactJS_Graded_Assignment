import { useEffect, useState } from "react"
import IItem from "../models/IItem"
import {getFavorites, getMoviesComing, getMoviesInTheatres, getTopRatedIndia, getTopRatedMovies,postFavourites} from '../service/items'
import './MoviesPane.css'
import {Heart} from 'react-bootstrap-icons'
import {NavLink, Modal} from 'react-bootstrap'
import './Header.css'
import {Search} from 'react-bootstrap-icons'
import ToastMessage from "./ToastMessage"




const MoviesPane = () =>{

    const [movies, setMovies] = useState<IItem[]>([]);
    const [show, setShow]=useState(false);
    let title:any;
    const[movieDetails, setMovieDetails] = useState<any>({})
    const [isAddedToFavourites, setIsAddedToFavourites] = useState<boolean|null>()

    useEffect(
        ()=>{
            fetchMoviesInTheatres();
        },[]
    )

    useEffect(
        ()=>{
            setIsAddedToFavourites(null)
        },[isAddedToFavourites]
    )


    let e:any = '';

    useEffect(
        ()=>{
            searchMovie(e);
        },[]
    )

    const fetchMoviesComingSoon = async () =>{
        const movies = await getMoviesComing();
        setMovies(movies)
        }


    const fetchMoviesInTheatres = async () =>{
            const movies = await getMoviesInTheatres();
            setMovies(movies)
    }

    const fetcTopRatedIndianMovies = async () =>{
            const movies = await getTopRatedIndia();
            setMovies(movies)
    }

    const fetcTopRatedMovies = async () =>{
        const movies = await getTopRatedMovies();
        setMovies(movies)
    }

   

    const fetchFavouriteMovies = async ()=>{
        const movies = await getFavorites();
        setMovies(movies)
    }

  

    let allMovies:IItem[] = [];

    const  getAllMovies = async ()=>{ 
        const comingSoon = await getMoviesComing();
        const inTheater = await getMoviesInTheatres();
        const topRatedIndian = await getTopRatedIndia();
        const topRated = await getTopRatedMovies();

        allMovies = [...comingSoon, ...inTheater,...topRatedIndian, ...topRated]
    }

    getAllMovies();
    

    const searchMovie = (e:any) =>{
        let searchResults:any = [];
            for(let i=0; i<allMovies.length; i++){
                if(e.target.value !=='')
                {
                    if(allMovies[i].title.includes(e.target.value)){
                            searchResults.push(allMovies[i])
                    }
                }
                else{
                    searchResults = [...allMovies]
                }
            }
        setMovies(searchResults);
    }


    let  favourites:any = [];

    const addFavourites = async (e:any) =>{
       const fav =  allMovies.find(movie =>{
            return   movie.title === e.target.parentElement.children[1].textContent;
          });

          let titles = favourites?.find((title: any) => title)
          if(!titles?.includes(fav?.title))
          {
            favourites.push(fav);
            setIsAddedToFavourites(true)
            await postFavourites(favourites[0]);
            
          }
          else{
              setIsAddedToFavourites(false)
          }
          
    }


  const setFavouriteTextContent = () =>{
      return 'Add to Favourites'
  }


  const handleShow = (e:any) =>{
    title = e.target.parentElement.children[1].textContent;
     let mov:any = allMovies.find(movie=>{return title === movie.title})

    setMovieDetails({title,
        Imdb:  mov.imdbRating,
     avgRating: mov.averageRating,
     duration: mov.duration,
     actors: mov.actors,
     contentRating: mov.contentRating,
     releaseDate: mov.releaseDate,
     storyLine: mov.storyline,
     posterUrl: mov.posterurl,
     genres: mov.genres})
    setShow(true)
}

const handleClose = () =>{
setShow(false)
}



    return (
        <>
        <div className='nav-container'>

                    <NavLink className='navlinks' onClick={fetchMoviesInTheatres}>Movies in Theatres</NavLink>
                    <NavLink className='navlinks' onClick={fetchMoviesComingSoon}>Coming Soon</NavLink>
                    <NavLink className='navlinks' onClick={fetcTopRatedIndianMovies}>Top Rated Indian</NavLink>
                    <NavLink className='navlinks' onClick={fetcTopRatedMovies}>Top Rated Movies</NavLink>
                    <NavLink className='navlinks' onClick={fetchFavouriteMovies}>Favourites</NavLink>


                    <div className="search">
                        <input  type="search" placeholder="Search Movies Here" onChange={searchMovie}/>
                            <button className='btn' type="submit">
                                <Search  className="fas fas-search s-icon"></Search>
                            </button>     
                    </div>
                    <hr className='section-line'/>

        </div>

        {<Modal style={{width:'200% !important', left:'0px'}} show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Movie Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <img src={movieDetails.posterUrl} style={{height: "600px", width: "260px"}}></img>
            {movieDetails&& <h1 style={{display:'inline-block', top:'20px', position:'absolute', marginLeft:'20px'}}>{movieDetails.title +`(${ new Date(movieDetails.releaseDate).getFullYear()})`}</h1> }
            {movieDetails&& <h1 style={{display:'inline-block', top:'80px', position:'absolute', marginLeft:'20px'}}>{`Actors: ${movieDetails.actors}`}</h1>}
            {movieDetails&& <h1 style={{display:'inline-block', top:'140px', position:'absolute', marginLeft:'20px'}}>{`Rating: ${movieDetails.avgRating}`}</h1>}
            {movieDetails&& <h1 style={{display:'inline-block', top:'200px', position:'absolute', marginLeft:'20px'}}>{`Genres: ${movieDetails.genres}`}</h1>}
            {movieDetails&& <h1 style={{display:'inline-block', top:'260px', position:'absolute', marginLeft:'20px'}}>{`Duration: ${movieDetails.duration}`}</h1>}
            {movieDetails&& <h1 style={{display:'inline-block', top:'320px', position:'absolute', marginLeft:'20px'}}>{`ReleaseDate: ${movieDetails.releaseDate}`}</h1>}
            {movieDetails&& <h1 style={{display:'inline-block', top:'380px', position:'absolute', marginLeft:'20px'}}>{`Story Line: ${movieDetails.storyLine}`}</h1>}
            </Modal.Body>
            </Modal> }
        
        {isAddedToFavourites===true? <ToastMessage message='Added To favuorites succesfully'/>:''}
        {!isAddedToFavourites===false?<ToastMessage message='Movied already added to favourites'/>:''}
        
       
        
        <div >
            
            {
                movies.map((movie, i)=>{
                     
     return <div className="cards" key={i}> 
                <div className="card col-sm-3" style={{width: "18rem"}} >
                        <div className="card-body">
                            <img src={movie.posterurl} onClick={handleShow} style={{height: "250px", width: "260px"}}></img>
                            <h5 className="card-title" style={{marginTop:"10px"}}>{movie.title}</h5>
                            <a href="#" className="card-link" onClick={addFavourites} style={{textDecoration:"none", color:"black", textAlign:"center"}}> Add to favourites <Heart style={{color:"red"}}/> </a>
                        </div>
                </div>
            </div>
                })
            }         

        </div>
        </>

    )
}

export default MoviesPane