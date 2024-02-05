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
         <section className="pt-10">
            <h2 className="text-center text-2xl">Post not found!</h2>
         </section>
      );
   }

   return (
      <article className="border-2 p-5 sm:max-w-lg drop-shadow rounded-lg border-[#D7D9CE] mt-10 m-auto overflow-hidden">
         <h2 className="sm:text-3xl text-2xl mb-2">{post.title}</h2>
         <p className="sm:text-xl text-lg  mb-7">{post.body}</p>
         <p className="flex justify-between mb-3">
            <Link className="underline hover:text-[#D7D9CE]/70 transition" to={`/post/edit/${postId}`}>Edit Post</Link>
            <div>
               <PostAuthor userId={post.userId} />
               <TimeAgo timestamp={post.date} />
            </div>
         </p>
         <ReactionButtons post={post} />
      </article>
   );
};

export default SinglePostPage;
