import { useSelector } from "react-redux";
import { FC, useEffect } from "react";
import { selectAllPosts, getPostsError, getPostsStatus, fetchPosts } from "./postsSlice"; 
import { useAppDispatch } from "../../app/store";
import PostsExcerpt from "./PostsExcerpt"; 

const PostList: FC = () => {
   const dispatch = useAppDispatch();

   const posts = useSelector(selectAllPosts);
   const postsStatus = useSelector(getPostsStatus);
   const error = useSelector(getPostsError);    

   useEffect(() => {
      if (postsStatus === 'idle') {
         dispatch(fetchPosts());
         console.log("виконується запит");
      }
   }, [postsStatus, dispatch]);

   let content;
   if (postsStatus === "loading") {
      content = <p>Loading...</p>
   } else if (postsStatus === 'succeeded') {
      const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date));
      content = orderedPosts.map(post => <PostsExcerpt key={post.id} post={post} />) 
   } else if (postsStatus === "failed") {
      content = <p>{error}</p>
   }

   return (
      <section>
         <h2>Posts</h2>
         {content}
      </section>
   );
};

export default PostList;
