import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { store } from "./app/store.ts";
import { Provider } from "react-redux";
import { fetchUsers } from "./features/users/usersSlice.ts";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { extendedApiSlice } from "./features/posts/postsSlice.ts";
import React from "react";

store.dispatch(fetchUsers());
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate())

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
      <Provider store={store}>
         <Router>
            <Routes>
               <Route path="/*" element={<App />} /> 
            </Routes>
         </Router>
      </Provider>
   </React.StrictMode>
);
