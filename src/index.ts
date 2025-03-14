import { serve } from '@hono/node-server'
import { Hono } from 'hono'
const app = new Hono()
/*
app.get('/', (c) => {
  return c.text('Hello Hono!')
})
  */
type Movie =
{
  id: string;
  title: string;
  director: string;
  releaseYear: number;
  genre: string;
  ratings: number[];
}
const movies: Movie[] =[];

//1st
app.post("/movies",async (c) => {
const body: Movie = await c.req.json();
if(!body.id || !body.title || !body.director || !body.releaseYear || !body.genre)
{
    return c.json({message:"Required fields are missing"},400);

}
else{
  movies.push(body);
  return c.json({message: "Created", movie: body },200);
}
});

//2nd
app.patch("/movies/:id",async (c) =>{
const id = c.req.param("id");
const body = await c.req.json();
const movie = movies.find((m) => m.id === id);
if(!movie)
{
  return c.json({message:"Movie not found"},404);
}
Object.assign(movie,body);
return c.json({message:"Movie is updated successfullt!!!"},200);
});

//7
app.get("/movies/top-rated", (c) => {
  if (movies.length === 0) {
    return c.json({ error: "No movies found" }, 404);
  }

  const ratedMovies = movies
    .filter((movie) => Array.isArray(movie.ratings) && movie.ratings.length > 0)
    .map((movie) => ({
      ...movie,
      averageRating: movie.ratings.reduce((a, b) => a + b, 0) / movie.ratings.length,
    }))
    .sort((a, b) => b.averageRating - a.averageRating); // Sort descending by average rating

  if (ratedMovies.length === 0) {
    return c.json({ error: "No movies have ratings" }, 404);
  }

  return c.json(ratedMovies, 200);

});


//3
app.get("/movies/:id", async (c) => {
const id = c.req.param("id");
//const body = await c.req.json();
const movie = movies.find((m) => m.id === id);
if(!movie)
{
  return c.json({message: "Movie not  Found"},404);
}
return c.json({message: "Movie is found", movie},200);
});

//4
app.delete("/movies/:id", async (c) => {
const id = c.req.param("id");
const index = movies.findIndex((m) => m.id === id);
if(index === -1)
{
  return c.json({message: "Movie not found"},404);
}
else{
  movies.splice(index, 1);
  return c.json({message: "Movie deleted SuccessfullY!!!"},200);

}
});

//5
app.post("/movies/:id/ratings", async (c) => {
const id = c.req.param("id");
const { rating }: { rating: number } = await c.req.json();  
if(rating < 1 || rating > 5)
{
  return c.json({message: "Rating should be between 1 to 5"},400);
}
const movie = movies.find((m) => m.id === id);
if(!movie)
  {
    return c.json({message: "Movie not found"},404);
  } 
  if (!movie.ratings) {movie.ratings = []; 
  }
  movie.ratings.push(rating);
  return c.json({message:"Rating added successfully!!!",movie});
});


//6th
app.get("/movies/:id/ratings", (c) => {
  const id = c.req.param("id");
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return c.json({ error: "Movie not found" }, 404);
  }
  if (!movie.ratings || movie.ratings.length === 0) {
    return c.json({ message: "No ratings available" }, 404);
  }
/*else{
let total = 0;
for (let rating of movie.ratings){
  total += rating;
}*/
//const AvgRating = total / movie.ratings.length;
//movie.ratings.push(rating);
  const total = movie.ratings.reduce((sum, rating) => sum + rating, 0);
  const avgRating = total / movie.ratings.length;

  return c.json({message: "Average rating found successfully!",AverageRating: avgRating,});
});



//8th
app.get("/movies/genre/:genre", (c) => {
  const { genre } = c.req.param();
  const filteredMovies = movies.filter((m) => m.genre.toLowerCase() === genre.toLowerCase());

  return filteredMovies.length ? c.json(filteredMovies) : c.json({ error: "No movies found" }, 404);
});

//9th
app.get("/movies/director/:director", (c) => {
  const { director } = c.req.param();
  const filteredMovies = movies.filter((m) => m.director.toLowerCase() === director.toLowerCase());

  return filteredMovies.length ? c.json(filteredMovies) : c.json({ error: "No movies found" }, 404);
});

//10th
app.get("/movies/search", (c) => {
  const keyword = c.req.query("keyword");
  if (!keyword) return c.json({ error: "Keyword required" }, 400);

  const results = movies.filter((m) => m.title.toLowerCase().includes(keyword.toLowerCase()));

  return results.length ? c.json(results) : c.json({ error: "No movies found" }, 404);
});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
