import { PayloadAction, createSlice, nanoid } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { sub } from "date-fns/sub";

type Reactions = {
   [key: string]: number;
};

export type Post = {
   id: string;
   title: string;
   content: string;
   userId: string;
   date: string;
   reactions: Reactions;
};

const initialState: Post[] = [
   {
      id: "1",
      title: "Learning Redux Toolkit",
      content: "I've heard good things.",
      userId: "2",
      date: sub(new Date(), { minutes: 10 }).toISOString(),
      reactions: { thumbsUp: 0, wow: 0, heart: 0, rocket: 0, coffee: 0 },
   },
   {
      id: "2",
      title: "Slices...",
      content: "The more I say slice, the more I want pizza.",
      userId: "1",
      date: sub(new Date(), { minutes: 5 }).toISOString(),
      reactions: { thumbsUp: 0, wow: 0, heart: 0, rocket: 0, coffee: 0 },
   },
];

const postsSlice = createSlice({
   name: "posts",
   initialState,
   reducers: {
      postAdded: {
         reducer: (state, action: PayloadAction<Post>) => {
            state.push(action.payload);
         },
         prepare: (title: string, content: string, userId: string) => {
            return {
               payload: {
                  id: nanoid(),
                  title,
                  content,
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
      reactionAdded: (state, action: PayloadAction<{postId: string, reaction: string}>) => {
         const { postId, reaction} = action.payload;
         const existingPost = state.find((post) => post.id === postId);
         if (existingPost) {
            existingPost.reactions[reaction]++;
         }
      },
   },
});

export const selectAllPosts = (state: RootState) => state.posts;

export const { postAdded, reactionAdded } = postsSlice.actions;

export default postsSlice.reducer;
