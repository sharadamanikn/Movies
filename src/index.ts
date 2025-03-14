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

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
