import { useSelector } from "react-redux";
import { selectAllUsers } from "./usersSlice";
import { Link } from "react-router-dom";

const UsersList = () => {
   const users = useSelector(selectAllUsers);

   const renderedUsers = users.map((user) => (
      <li key={user.id}>
         <Link className="underline hover:text-[#D7D9CE]/70 transition" to={`/user/${user.id}`}>{user.name}</Link>
      </li>
   ));

   return (
      <section className="pt-10 space-y-5">
         <h2 className="text-2xl font-semibold">All Users</h2>
         <ul className="text-xl space-y-2">{renderedUsers}</ul>
      </section>
   );
};

export default UsersList;
