import { useSelector } from "react-redux";
import { FC } from "react";
import { selectPostIds } from "./postsSlice"; 
import PostsExcerpt from "./PostsExcerpt"; 
import { useGetPostsQuery } from "./postsSlice";

const PostList: FC = () => { 
   const {
      isLoading,
      isSuccess,
      isError,
      error
   } = useGetPostsQuery();

   const orderedPostIds = useSelector(selectPostIds);

   let content;
   if (isLoading) {
      content = <p>Loading...</p>
   } else if (isSuccess) { 
      content = orderedPostIds.map(postId => <PostsExcerpt key={postId} postId={postId} />) 
   } else if (isError) {
      console.error(error); 
      content = <p>Something went wrong( <br /> Please try again</p>
   }

   return (
      <section>
         <h2>Posts</h2>
         {content}
      </section>
   );
};

export default PostList;
