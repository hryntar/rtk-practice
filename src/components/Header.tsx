import { Link } from "react-router-dom";

const Header = () => {
   return (
      <header className="header">
         <h2>Redux Blog</h2>
         <nav>
            <ul>
               <li>
                  <Link to="/">Home</Link>
               </li>
               <li>
                  <Link to="/post">Post</Link>
               </li>
               <li>
                  <Link to="/user">Users</Link>
               </li>
            </ul>
         </nav>
      </header>
   );
};

export default Header;
