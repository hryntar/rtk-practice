import { FC } from "react";
import { Post } from "./postsSlice";
import { useAddReactionMutation } from "./postsSlice";

const reactionEmoji = {
   thumbsUp: "👍",
   wow: "🤩",
   heart: "❤️",
   rocket: "🚀",
   coffee: "☕",
};

const ReactionButtons: FC<{ post: Post }> = ({ post }) => {
   const [addReaction] = useAddReactionMutation();

   const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
      return (
         <button
            key={name}
            type="button"
            onClick={() => {
               const newValue = post.reactions[name] + 1;
               addReaction({ postId: post.id, reactions: { ...post.reactions, [name]: newValue } });
            }}
         >
            {emoji} {post.reactions[name]}
         </button>
      );
   });

   return <div className="flex item-center gap-5">{reactionButtons}</div>;
};

export default ReactionButtons;
