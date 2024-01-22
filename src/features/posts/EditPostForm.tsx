import { FC, FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectAllUsers } from "../users/usersSlice";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../app/store";
import { StatusType, deletePost, selectPostById, updatePost } from "./postsSlice";

const EditPostForm: FC = () => {
   const { postId } = useParams();
   const navigate = useNavigate();

   const post = useSelector((state: RootState) => (postId ? selectPostById(state, typeof postId === "number" ? postId : Number(postId)) : null));
   const users = useSelector(selectAllUsers);

   const [title, setTitle] = useState(post?.title);
   const [content, setContent] = useState(post?.body);
   const [userId, setUserId] = useState(post?.userId);
   const [requestStatus, setRequestStatus] = useState<StatusType>("idle");

   const dispatch = useAppDispatch();

   if (!post) {
      return (
         <section>
            <h2>Post not found!</h2>
         </section>
      );
   }

   const canPost = postId && title && content && userId && requestStatus === "idle";

   const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      if (canPost) {
         try {
            setRequestStatus("loading");
            dispatch(updatePost({ id: Number(postId), title, body: content, userId, reactions: post.reactions, date: "" })).unwrap();
            setTitle("");
            setContent("");
            setUserId(0);
            navigate(`/post/${postId}`);
         } catch (error) {
            console.error("Failed to save the post", error);
         } finally {
            setRequestStatus("idle");
         }
      }
   };

   const userOptions = users.map((user) => (
      <option key={user.id} value={user.id}>
         {user.name}
      </option>
   ));

   const handleDeletePost = () => {
      try {
         setRequestStatus("loading");
         dispatch(deletePost({ id: post.id })).unwrap();
         setTitle("");
         setContent("");
         setUserId(0);
         navigate(`/`);
      } catch (error) {
         console.error("Failed to delete post", error);
      } finally {
         setRequestStatus("idle");
      }
   };

   return (
      <section>
         <h2>Edit post</h2>
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
            <button className="deleteButton" onClick={handleDeletePost} type="submit">
               Delete Post
            </button>
         </form>
      </section>
   );
};

export default EditPostForm;
