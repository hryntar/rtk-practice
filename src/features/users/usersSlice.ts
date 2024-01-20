import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type User = {
   id: string,
   name: string
}

const initialState: User[] = [
   {id: "1", name: "Sara Larson"},
   {id: "2", name: "Mike Oliver"},
   {id: "3", name: "Dave Gray"},
]

const usersSlice = createSlice({
   name: "users",
   initialState,
   reducers: {

   }
}) 

export const selectAllUsers = (state: RootState) => state.users;

export default usersSlice.reducer;