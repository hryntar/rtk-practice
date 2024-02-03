import { EntityState, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { sub } from "date-fns/sub";
import { apiSlice } from "../api/apiSlice";

const postsAdapter = createEntityAdapter<Post>({
   sortComparer: (a, b) => b.date.localeCompare(a.date),
});

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

const initialState = postsAdapter.getInitialState();

export const extendedApiSlice = apiSlice.injectEndpoints({
   endpoints: (builder) => ({
      getPosts: builder.query<EntityState<Post, string | number>, void>({
         query: () => "/posts",
         transformResponse: (responseData: Post[]) => {
            let min = 1;
            const loadedPosts = responseData.map((post) => {
               if (!post.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
               if (!post.reactions)
                  post.reactions = {
                     thumbsUp: 0,
                     wow: 0,
                     heart: 0,
                     rocket: 0,
                     coffee: 0,
                  };
               return post;
            });
            return postsAdapter.setAll(initialState, loadedPosts);
         },
         providesTags: (result) => [
            { type: "Post", id: "LIST" },
            ...(result?.ids ?? []).map((id: string | number) => ({ type: "Post" as const, id })),
         ],
      }),
      getPostsByUserId: builder.query({
         query: (id: number) => `/posts?userId=${id}`,
         transformResponse: (responseData: Post[]) => {
            let min = 1;
            const loadedPosts = responseData.map((post) => {
               if (!post.date) post.date = sub(new Date(), { minutes: min++ }).toISOString();
               if (!post.reactions)
                  post.reactions = {
                     thumbsUp: 0,
                     wow: 0,
                     heart: 0,
                     rocket: 0,
                     coffee: 0,
                  };
               return post;
            });
            return postsAdapter.setAll(initialState, loadedPosts);
         },
         providesTags: (result) => {
            return [...(result?.ids ?? []).map((id) => ({ type: "Post" as const, id }))];
         },
      }),
      addNewPost: builder.mutation<Post, Partial<Post>>({
         query: (initialPost) => ({
            url: "/posts",
            method: "POST",
            body: {
               ...initialPost,
               userId: Number(initialPost.userId),
               date: new Date().toISOString(),
               reactions: {
                  thumbsUp: 0,
                  wow: 0,
                  heart: 0,
                  rocket: 0,
                  coffee: 0,
               },
            },
         }),
         invalidatesTags: [{ type: "Post", id: "LIST" }],
      }),
      updatePost: builder.mutation<Post, Partial<Post>>({
         query: (initialPost) => ({
            url: `/posts/${initialPost.id}`,
            method: "PUT",
            body: {
               ...initialPost,
               date: new Date().toISOString(),
            },
         }),
         invalidatesTags: (_, __, arg) => [{ type: "Post", id: arg.id }],
      }),
      deletePost: builder.mutation<Post, { id: number | string }>({
         query: ({ id }) => ({
            url: `/posts/${id}`,
            method: "DELETE",
            body: { id },
         }),
         invalidatesTags: (_, __, arg) => [{ type: "Post", id: arg.id }],
      }),
      addReaction: builder.mutation({
         query: ({postId, reactions}) => ({
            url: `/posts/${postId}`,
            method: "PATCH",
            body: { reactions },
         }),
         async onQueryStarted({postId, reactions}, { dispatch, queryFulfilled }) {
            const patchResult = dispatch(
               extendedApiSlice.util.updateQueryData("getPosts", undefined, (draft) => {
                  const post = draft.entities[postId];
                  if (post) post.reactions = reactions;
               })
            )
            try {
               await queryFulfilled;
            } catch (error) {
               patchResult.undo();
            }
         }
      })
   }),
});

export const { 
   useGetPostsQuery, 
   useGetPostsByUserIdQuery, 
   useAddNewPostMutation, 
   useDeletePostMutation, 
   useUpdatePostMutation,
   useAddReactionMutation
} = extendedApiSlice;

export const selectPostsResult = extendedApiSlice.endpoints.getPosts.select();

const selectPostData = createSelector(selectPostsResult, (postsResult) => postsResult.data);

export const {
   selectAll: selectAllPosts,
   selectById: selectPostById,
   selectIds: selectPostIds,
} = postsAdapter.getSelectors<RootState>((state) => selectPostData(state) ?? initialState);
