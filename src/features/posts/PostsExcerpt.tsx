import { FC, memo } from "react";
import { selectPostById } from "./postsSlice";
import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const PostsExcerpt: FC<{ postId: number | string }> = memo(({ postId }) => {
   const post = useSelector((state: RootState) => selectPostById(state, postId));

   return (
      <article className="border-2 p-5 sm:max-w-lg drop-shadow rounded-lg border-[#D7D9CE] overflow-hidden">
         <h2 className="sm:text-3xl text-2xl mb-2">{post.title}</h2>
         <p className="sm:text-xl text-lg  mb-7">{post.body.substring(0, 75)}...</p>
         <p className="flex justify-between mb-3">
            <Link to={`post/${post.id}`} className="underline hover:text-[#D7D9CE]/70 transition" >View Post</Link>
            <div>
               <PostAuthor userId={post.userId} />
               <TimeAgo timestamp={post.date} />   
            </div>
         </p>
         <ReactionButtons  post={post} />
      </article>
   );
});

export default PostsExcerpt;
