import { PayloadAction, createSlice, createAsyncThunk, createSelector, createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios, { AxiosResponse } from "axios";
import { sub } from "date-fns/sub";

const POST_URL = "https://jsonplaceholder.typicode.com/posts";

const postsAdapter = createEntityAdapter<Post>({
   sortComparer: (a, b) => b.date.localeCompare(a.date)
})

type Reactions = {
   [key: string]: number;
};

export type Post = {
   id: string | number;
   title: string;
   body: string;
   userId: number;
   date: string;
   reactions: Reactions;
};

export type StatusType = "idle" | "loading" | "succeeded" | "failed";

interface IInitialState extends EntityState<Post, string | number> { 
   status: StatusType;
   error: string | null;
}

const initialState: IInitialState = postsAdapter.getInitialState({ 
   status: "idle",
   error: null,
});

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
   const { data }: AxiosResponse<Post[]> = await axios.get(POST_URL);
   return data;
});

export const addNewPost = createAsyncThunk("posts/addNewPost", async (initialPost: { title: string; body: string; userId: number }) => {
   const response: AxiosResponse<Post> = await axios.post<Post>(POST_URL, initialPost);
   return response.data;
});

export const updatePost = createAsyncThunk("posts/updatePost", async (initialPost: Post) => {
   try {
      const { id } = initialPost;
      const response: AxiosResponse<Post> = await axios.put<Post>(`${POST_URL}/${id}`, initialPost);
      return response.data;
   } catch (error) {
      return initialPost;
   }
});

export const deletePost = createAsyncThunk("posts/deletePost", async (initialPost: { id: string | number }) => {
   const { id } = initialPost;
   const response: AxiosResponse<Post> = await axios.delete<Post>(`${POST_URL}/${id}`);
   if (response.status === 200) return initialPost;
   return `${response.status}: ${response.statusText}`;
});

const postsSlice = createSlice({
   name: "posts",
   initialState,
   reducers: { 
      reactionAdded: (state, action: PayloadAction<{ postId: number | string; reaction: string }>) => {
         const { postId, reaction } = action.payload;
         const existingPost = state.entities[postId];
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
                  return post;
               }); 
               postsAdapter.upsertMany(state, loadedPosts);
            }
         })
         .addCase(fetchPosts.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message!;
         })
         .addCase(addNewPost.fulfilled, (state, { payload }) => {
            if (typeof payload !== "string") {
               const sortedPosts = postsAdapter.getSelectors().selectAll(state).sort((a, b) => {
                  if (a.id > b.id) return 1;
                  if (a.id < b.id) return -1;
                  return 0;
               });
               payload.id = Number(sortedPosts[sortedPosts.length - 1].id) + 1;
               payload.date = new Date().toISOString();
               payload.reactions = {
                  thumbsUp: 0,
                  wow: 0,
                  heart: 0,
                  rocket: 0,
                  coffee: 0,
               };
               postsAdapter.addOne(state, payload);
            }
         })
         .addCase(updatePost.fulfilled, (state, { payload }) => {
            if (!payload.id) {
               console.log("Update could not complete");
               console.log(payload);
               return;
            } 
            payload.date = new Date().toISOString();
            postsAdapter.upsertOne(state, payload);
         })
         .addCase(deletePost.fulfilled, (state, { payload }) => {
            if (typeof payload === "string" || !payload.id) {
               console.log("Failed to delete post" + payload);
            } else {
               const { id } = payload;
               postsAdapter.removeOne(state, id);
            }
         });
   },
});

export const {
   selectAll: selectAllPosts,
   selectById: selectPostById,
   selectIds: selectPostIds,
} = postsAdapter.getSelectors<RootState>((state) => state.posts); 

export const getPostsStatus = (state: RootState) => state.posts.status;
export const getPostsError = (state: RootState) => state.posts.error; 
export const selectPostsByUser = createSelector(
   [selectAllPosts, (_: RootState, userId: number) => userId],
   (posts, userId) => posts.filter((post: Post) => post.userId === userId)
);

export const { reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
