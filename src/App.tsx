import React, { useState, createContext } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import MessageBoard from './MessageBoard';
import { AllPosts } from './AllPosts';
import Welcome, { welcomeLoader } from './Welcome';
import { PostView } from './Post';
import Navbar from './Navbar';
import { SupashipUserInfo, useSession  } from './use-session';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [{
      path: "",
      element: <MessageBoard />,
      children: [
        {
          path: ":pageNumber",
          element: <AllPosts />,
        },
        {
          path: "post/:postId",
          element: <PostView />
        },
      ],
    },
    {
      path: 'welcome',
      element: <Welcome />,
      loader: welcomeLoader,
    }],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

export const UserContext = createContext<SupashipUserInfo>({
  session: null,
  profile: null,
})

function Layout () {
  const SupashipUserInfo = useSession();
  return <>
    <UserContext.Provider value={SupashipUserInfo}>
      <Navbar />
      <Outlet />
    </UserContext.Provider>
  </>
}