import AddPostForm from "./features/posts/AddPostForm";
import PostList from "./features/posts/PostList";

const App = () => { 
   return (
      <main className="App">
         <AddPostForm />
         <PostList />
      </main>
   );
};

export default App;
