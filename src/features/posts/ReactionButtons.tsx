import { FC } from "react";
import { useAppDispatch } from "../../app/store";
import { Post, reactionAdded } from "./postsSlice";

const reactionEmoji = {
   thumbsUp: "👍",
   wow: "🤩",
   heart: "❤️",
   rocket: "🚀",
   coffee: "☕",
};

const ReactionButtons: FC<{ post: Post }> = ({ post }) => {
   const dispatch = useAppDispatch();

   const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
      return (
         <button key={name} type="button" className="reactionButton" onClick={() => dispatch(reactionAdded({ postId: post.id, reaction: name }))}>
            {emoji} {post.reactions[name]}
         </button>
      );
   });

   return <div>{reactionButtons}</div>;
};

export default ReactionButtons;
