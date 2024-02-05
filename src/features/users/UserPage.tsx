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
            - <Link className="underline hover:text-[#D7D9CE]/70 transition" to={`/post/${postId}`}>{entities[postId].title}</Link>
         </li>
      ));
   } else if (isError) {
      console.error(error); 
      content = <p>Something went wrong( <br /> Please try again</p>;
   }

   return (
      <section className="space-y-3 pt-10">
         <h2 className="text-3xl">{user?.name}</h2>
         <ol className="text-lg">{content}</ol>
      </section>
   );
};

export default UserPage;
