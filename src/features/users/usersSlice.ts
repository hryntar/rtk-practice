import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";

type User = {
   id: number;
   name: string;
};

const initialState: User[] = [];

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
   const { data } = await axios.get(USERS_URL);
   return data;
});

const usersSlice = createSlice({
   name: "users",
   initialState,
   reducers: {},
   extraReducers(builder) {
      builder.addCase(fetchUsers.fulfilled, (_, action) => {
         return action.payload;
      });
   },
});

export const selectAllUsers = (state: RootState) => state.users;

export default usersSlice.reducer;
