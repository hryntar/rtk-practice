import { Link } from "react-router-dom";
import { Separator } from "./ui/separator";
import { Button } from "@/components/ui/button"


const Header = () => {
   return (
      <header className="px-4 py-8 absolute z-10 w-full">
         <div className="flex justify-between items-center max-container">
            <h2 className="sm:text-3xl text-xl font-semibold leading-normal"><Link to="/">Redux Blog</Link></h2>
            <nav>
               <ul className="flex h-5 items-center sm:space-x-7 space-x-3 text-lg leading-normal"> 
                  <li>
                     <Link to="/post"><Button className="hover:text-[#040404] hover:bg-[#D7D9CE]" variant="ghost" size="sm">Add Post</Button></Link>
                  </li>
                  <Separator orientation="vertical" />
                  <li>
                     <Link to="/user"><Button className="hover:text-[#040404] hover:bg-[#D7D9CE]" variant="ghost" size="sm" >All Users</Button></Link>
                  </li>
               </ul>
            </nav>
         </div>
      </header>
   );
};

export default Header;
