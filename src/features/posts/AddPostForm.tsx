import { FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";
import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "./postsSlice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea"


const AddPostForm = () => {
   const [addNewPost, { isLoading }] = useAddNewPostMutation();
   const [open, setOpen] = useState(false);
   const [value, setValue] = useState(""); 

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
            await addNewPost({ title, body: content, userId }).unwrap();
            setTitle("");
            setContent("");
            setUserId(0);
            navigate(`/`);
         } catch (error) {
            console.error("Failed to save the post", error);
         }
      }
   };    

   return (
      <section className="pt-10 grid justify-center w-full gap-y-10">
         <h2 className="text-3xl">Add a New Post</h2>
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
               placeholder="My new post..."
               onChange={(e) => setTitle(e.target.value)}
            />
            <Label htmlFor="postAuthor" className="mb-2 text-[#D7D9CE]">Author: </Label> 
            <Popover open={open} onOpenChange={setOpen}>
               <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={open} className="transition bg-[#040404] mb-5 hover:bg-[#141414] max-w-[640px] justify-between text-[#D7D9CE] hover:text-[#D7D9CE]"> 
                     {value ? users.find((user) => user.name.toLowerCase() === value)?.name : "Select an author..."}
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
            <Textarea className="bg-[#040404] transition ease-linear mb-5 min-h-[150px]"  required name="postContent" value={content} id="postContent" onChange={(e) => setContent(e.target.value)} />
            <Button className="text-[#040404] bg-[#D7D9CE] hover:bg-[#b8b9b6] transition" disabled={!canPost} onClick={handleSubmit} type="submit">
               Save Post
            </Button>
         </form>
      </section>
   );
};

export default AddPostForm;
