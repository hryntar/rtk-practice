import { FC } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { RootState } from "../../app/store";
import { selectUserById } from "./usersSlice";
import { useGetPostsByUserIdQuery } from "../posts/postsSlice";

const UserPage: FC = () => {
   const { userId } = useParams();

   const user = useSelector((state: RootState) => selectUserById(state, Number(userId)));

   const {
      data: postsForUser,
      isLoading,
      isSuccess,
      isError,
      error,
   } = useGetPostsByUserIdQuery(Number(userId));
   

   let content;
   if (isLoading) {
      content = <p>Loading...</p>;
   } else if (isSuccess) {
      const { ids, entities } = postsForUser;
      content = ids.map((postId) => (
         <li key={postId}>
            <Link to={`/post/${postId}`}>{entities[postId].title}</Link>
         </li>
      ));
   } else if (isError) {
      console.error(error); 
      content = <p>Something went wrong( <br /> Please try again</p>;
   }

   return (
      <section>
         <h2>{user?.name}</h2>
         <ol>{content}</ol>
      </section>
   );
};

export default UserPage;
