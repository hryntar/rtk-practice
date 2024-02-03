import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";
import { RootState } from "../../app/store";
import { FC } from "react";
import { Link, useParams } from "react-router-dom";

const SinglePostPage: FC = () => {
   const { postId } = useParams(); 

   const post = useSelector((state: RootState) => postId ? selectPostById(state, typeof postId === 'number' ? postId : Number(postId)) : null) ; 

   if (!post) {
      return (
         <section>
            <h2>Post not found!</h2>
         </section>
      );
   }

   return (
      <article>
         <h2>{post.title}</h2>
         <p>{post.body}</p>
         <p className="postCredit">
            <Link to={`/post/edit/${postId}`}>Edit Post</Link>
            <PostAuthor userId={post.userId} />
            <TimeAgo timestamp={post.date} />
         </p>
         <ReactionButtons post={post} />
      </article>
   );
};

export default SinglePostPage;
