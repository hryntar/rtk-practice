import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";
import { FC } from "react";

const PostAuthor: FC<{userId: number}> = ({userId}) => {
   const users = useSelector(selectAllUsers);

   const author = users.find((user) => user.id === Number(userId));

   return <span>by {author ? author.name : "Unknown author"}</span>;
};

export default PostAuthor;
