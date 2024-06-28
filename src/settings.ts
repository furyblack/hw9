import express, {Request, Response} from "express";
import {blogCollection, postCollection, usersCollection} from "./db/db";
import {postRoute} from "./routes/post-route";
import {blogRoute} from "./routes/blog-route";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {commentRouter} from "./routes/comment-router";
import cookieParser from "cookie-parser";

export const app = express();

// подключение роутеров
app.use(cookieParser())
app.use(express.json())
app.use('/posts', postRoute)
app.use('/blogs', blogRoute)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentRouter)


app.delete('/testing/all-data', async (req:Request, res: Response)=>{
    await blogCollection.deleteMany({})
    await postCollection.deleteMany({})
    await usersCollection.deleteMany({})
    res.sendStatus(204)
})