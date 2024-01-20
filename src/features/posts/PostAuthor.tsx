import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";
import { FC } from "react";

const PostAuthor: FC<{userId: string}> = ({userId}) => {
   const users = useSelector(selectAllUsers);

   const author = users.find((user) => user.id === userId);

   return <span>by {author ? author.name : "Unknown author"}</span>;
};

export default PostAuthor;
