import { Route, Routes } from "react-router-dom";
import AddPostForm from "./features/posts/AddPostForm";
import PostList from "./features/posts/PostList";
import Layout from "./components/Layout";
import SinglePostPage from "./features/posts/SinglePostPage";
import EditPostForm from "./features/posts/EditPostForm";

const App = () => { 
   return (
     <Routes>
         <Route path="/" element={<Layout />}>
            <Route index element={<PostList/>} />
            <Route path="post">
               <Route index element={<AddPostForm/>} />
               <Route path=':postId' element={<SinglePostPage />} /> 
               <Route path='edit/:postId' element={<EditPostForm />} /> 
            </Route>
         </Route>
     </Routes>
   );
};

export default App;
