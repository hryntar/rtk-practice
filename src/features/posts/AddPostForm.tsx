import { FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";
import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "./postsSlice";

const AddPostForm = () => {
   const [addNewPost, { isLoading }] = useAddNewPostMutation();

   const [title, setTitle] = useState("");
   const [userId, setUserId] = useState(0);
   const [content, setContent] = useState("");
   
   const navigate = useNavigate();

   const users = useSelector(selectAllUsers); 

   const canPost: boolean = [title, content, userId].every(Boolean) && !isLoading;

   const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();
      if (canPost) {
         try {
            await addNewPost({ title, body: content, userId}).unwrap();
            setTitle("");
            setContent("");
            setUserId(0);
            navigate(`/`);
         } catch (error) {
            console.error("Failed to save the post", error);
         }
      }
   };

   const userOptions = users.map((user) => (
      <option key={user.id} value={user.id}>
         {user.name}
      </option>
   ));

   return (
      <section>
         <h2>Add a New Post</h2>
         <form>
            <label htmlFor="postTitle">Post Title: </label>
            <input required type="text" name="postTitle" value={title} id="postTitle" onChange={(e) => setTitle(e.target.value)} />
            <label htmlFor="postAuthor">Author: </label>
            <select required name="postAuthor" value={userId} id="postAuthor" onChange={(e) => setUserId(Number(e.target.value))}>
               <option value=""></option>
               {userOptions}
            </select>
            <label htmlFor="postContent">Content: </label>
            <textarea required name="postContent" value={content} id="postContent" onChange={(e) => setContent(e.target.value)} />
            <button disabled={!canPost} onClick={handleSubmit} type="submit">
               Save Post
            </button>
         </form>
      </section>
   );
};

export default AddPostForm;
