import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
   return (
      <>
         <Header />
         <main className="max-container py-[100px] px-3">
            <Outlet />
         </main>
      </>
   );
};

export default Layout;
