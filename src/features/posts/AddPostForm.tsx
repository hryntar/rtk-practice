import { FormEvent, useState } from "react";
import { useAppDispatch } from "../../app/store";
import { addNewPost } from "./postsSlice";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";

const AddPostForm = () => {
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");
   const [userId, setUserId] = useState(0);
   const [addRequestStatus, setAddRequestStatus] = useState("idle");

   const canPost: boolean = [title, content, userId].every(Boolean) && addRequestStatus === "idle";

   const users = useSelector(selectAllUsers);

   const dispatch = useAppDispatch();

   const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      if (canPost) {
         try {
            setAddRequestStatus("pending");
            dispatch(addNewPost({title, body: content, userId})).unwrap();
            setTitle('');
            setContent('');
            setUserId(0);  
         } catch (error) {
            console.error("Failed to save the post", error);
         } finally {
            setAddRequestStatus("idle");
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
