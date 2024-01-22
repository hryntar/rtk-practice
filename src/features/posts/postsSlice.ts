import { PayloadAction, createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios, { AxiosResponse } from "axios";
import { sub } from "date-fns/sub";

const POST_URL = "https://jsonplaceholder.typicode.com/posts";

type Reactions = {
   [key: string]: number;
};

export type Post = {
   id: string;
   title: string;
   body: string;
   userId: number;
   date: string;
   reactions: Reactions;
};

interface IInitialState {
   posts: Post[];
   status: "idle" | "loading" | "succeeded" | "failed";
   error: string | null;
}

const initialState: IInitialState = {
   posts: [],
   status: "idle",
   error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
   const { data }: AxiosResponse<Post[]> = await axios.get(POST_URL);
   return data;
});

export const addNewPost = createAsyncThunk("posts/addNewPost", async (initialPost: { title: string; body: string; userId: number }) => {
   const response: AxiosResponse<Post> = await axios.post<Post>(POST_URL, initialPost);
   return response.data;
});

const postsSlice = createSlice({
   name: "posts",
   initialState,
   reducers: {
      postAdded: {
         reducer: (state, action: PayloadAction<Post>) => {
            state.posts.push(action.payload);
         },
         prepare: (title: string, body: string, userId: number) => {
            return {
               payload: {
                  id: nanoid(),
                  title,
                  body,
                  userId,
                  date: new Date().toISOString(),
                  reactions: {
                     thumbsUp: 0,
                     wow: 0,
                     heart: 0,
                     rocket: 0,
                     coffee: 0,
                  },
               },
            };
         },
      },
      reactionAdded: (state, action: PayloadAction<{ postId: string; reaction: string }>) => {
         const { postId, reaction } = action.payload;
         const existingPost = state.posts.find((post) => post.id === postId);
         if (existingPost) {
            existingPost.reactions[reaction]++;
         }
      },
   },
   extraReducers(builder) {
      builder
         .addCase(fetchPosts.pending, (state) => {
            state.status = "loading"; 
         })
         .addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = "succeeded";
            // Adding date and reactions
            let min = 1;
            if (typeof action.payload !== "string") {
               const loadedPosts = action.payload.map((post: Post) => {
                  post.date = sub(new Date(), { minutes: min++ }).toISOString();
                  post.reactions = {
                     thumbsUp: 0,
                     wow: 0,
                     heart: 0,
                     rocket: 0,
                     coffee: 0,
                  };
                  post.id = nanoid();
                  return post;
               });

               state.posts = state.posts.concat(loadedPosts);
            }
         })
         .addCase(fetchPosts.rejected, (state, action) => { 
            state.status = "failed";
            state.error = action.error.message!; 
         })
         .addCase(addNewPost.fulfilled, (state, { payload }) => {
            if (typeof payload !== "string") {
               const sortedPosts = state.posts.sort((a, b) => {
                  if (a.id > b.id) return 1;
                  if (a.id < b.id) return -1;
                  return 0;
               });
               payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
               payload.date = new Date().toISOString();
               payload.reactions = {
                  thumbsUp: 0,
                  wow: 0,
                  heart: 0,
                  rocket: 0,
                  coffee: 0,
               };
               state.posts.push(payload);
            }
         });
   },
});

export const selectAllPosts = (state: RootState) => state.posts.posts;
export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error;
export const selectPostById = (state: RootState, postId: string) => (
   state.posts.posts.find(post => post.id === postId)
);

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
