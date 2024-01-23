import { FC } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { RootState } from "../../app/store";
import { selectUserById } from "./usersSlice";
import { selectPostsByUser } from "../posts/postsSlice";

const UserPage: FC = () => {
   const { userId } = useParams();

   const user = useSelector((state: RootState) => selectUserById(state, Number(userId)));

   const postsForUser = useSelector((state: RootState) => selectPostsByUser(state, Number(userId)));

   const postsTitles = postsForUser.map((post) => (
      <li key={post.id}>
         <Link to={`/post/${post.id}`}>{post.title}</Link>
      </li>
   ));

   return (
      <section>
         <h2>{user?.name}</h2>
         <ol>{postsTitles}</ol>
      </section>
   );
};

export default UserPage;
