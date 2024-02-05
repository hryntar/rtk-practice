import { FC, FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { selectAllUsers } from "../users/usersSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { selectPostById } from "./postsSlice";
import { useUpdatePostMutation, useDeletePostMutation } from "./postsSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const EditPostForm: FC = () => {
   const { postId } = useParams();
   const navigate = useNavigate();

   const [updatePost, { isLoading }] = useUpdatePostMutation();
   const [deletePost] = useDeletePostMutation();

   const post = useSelector((state: RootState) => (postId ? selectPostById(state, typeof postId === "number" ? postId : Number(postId)) : null));
   const users = useSelector(selectAllUsers); 
   
   const [title, setTitle] = useState(post?.title);
   const [content, setContent] = useState(post?.body);
   const [userId, setUserId] = useState(post?.userId);
   
   const userName = users.find((user) => user.id === userId)?.name || "";
   
   const [value, setValue] = useState(userName); 
   const [open, setOpen] = useState(false);
   
   if (!post) {
      return (
         <section className="pt-10">
            <h2 className="text-center text-2xl">Post not found!</h2>
         </section>
      );
   }

   const canPost = postId && title && content && userId && !isLoading;

   const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();
      if (canPost) {
         try {
            await updatePost({ id: Number(postId), title, body: content, userId, reactions: post.reactions, date: "" }).unwrap();
            setTitle("");
            setContent("");
            setUserId(0);
            navigate(`/post/${postId}`);
         } catch (error) {
            console.error("Failed to save the post", error);
         }
      }
   }; 

   const handleDeletePost = async (event: FormEvent) => {
      event.preventDefault();
      try {
         await deletePost({ id: post.id }).unwrap();
         setTitle("");
         setContent("");
         setUserId(0);
         navigate(`/`);
      } catch (error) {
         console.error("Failed to delete post", error);
      }
   };

   return (
      <section className="pt-10 grid justify-center w-full gap-y-10">
         <h2 className="text-3xl">Edit post</h2>
         <form className="flex flex-col min-w-[330px] sm:min-w-[640px]">
            <Label htmlFor="postTitle" className="mb-2 text-[#D7D9CE]">
               Post Title:{" "}
            </Label>
            <Input
               className="bg-[#040404] transition ease-linear mb-5"
               required
               type="text"
               name="postTitle"
               value={title}
               id="postTitle"
               onChange={(e) => setTitle(e.target.value)}
            />
            <Label className="mb-2 text-[#D7D9CE]" htmlFor="postAuthor">Author: </Label>
            <Popover open={open} onOpenChange={setOpen}>
               <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={open} className="transition bg-[#040404] mb-5 hover:bg-[#141414] max-w-[640px] justify-between text-[#D7D9CE] hover:text-[#D7D9CE]"> 
                     {value ? users.find((user) => user.name.toLowerCase() === value.toLowerCase())?.name : "Select an author..."}
                     <ChevronsUpDown className="ml-2 h-4 w-4 " />
                  </Button>
               </PopoverTrigger>
               <PopoverContent className="sm:w-[640px] p-0 bg-[#040404] text-[#D7D9CE]">
                  <Command className="bg-[#040404] text-[#D7D9CE]">
                     <CommandInput placeholder="Search user..." />
                     <CommandEmpty>No user found.</CommandEmpty>
                     <CommandGroup className="bg-[#040404] text-[#D7D9CE] max-h-[250px] overflow-y-auto ">
                        {users.map((user) => (
                           <CommandItem
                              key={user.id}
                              value={user.name}
                              onSelect={(currentValue: string) => {
                                 setValue(currentValue === value ? "" : currentValue); 
                                 setUserId(user.id);
                                 setOpen(false);
                              }}
                              className="transition cursor-pointer"
                           >
                              <Check className={cn("mr-2 h-4 w-4", value === user.name.toLowerCase() ? "opacity-100" : "opacity-0")} />
                              {user.name}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </Command>
               </PopoverContent>
            </Popover>
            <Label className="mb-2 text-[#D7D9CE]" htmlFor="postContent">Content: </Label>
            <Textarea className="bg-[#040404] transition ease-linear mb-5 min-h-[150px]" required name="postContent" value={content} id="postContent" onChange={(e) => setContent(e.target.value)} />
            <Button className="text-[#040404] bg-[#D7D9CE] hover:bg-[#b8b9b6] transition mb-3" disabled={!canPost} onClick={handleSubmit} type="submit">
               Save Post
            </Button>
            <Button className="text-[#D7D9CE] bg-[#b0402d] hover:bg-[#d25a45] transition" onClick={handleDeletePost} type="submit">
               Delete Post
            </Button>
         </form>
      </section>
   );
};

export default EditPostForm;
