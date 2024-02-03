import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";
import { FC } from "react";
import { Link } from "react-router-dom";

const PostAuthor: FC<{userId: number}> = ({userId}) => {
   const users = useSelector(selectAllUsers);

   const author = users.find((user) => user.id === Number(userId));

   return <span>by {author ? <Link to={`/user/${userId}`}>{author.name}</Link> : "Unknown author"}</span>;
};

export default PostAuthor;
