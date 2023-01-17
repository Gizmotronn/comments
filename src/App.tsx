import React, { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import MessageBoard from './MessageBoard';
import AllPosts from './AllPosts';
import Welcome from './Welcome';
import PostView from './PostView';
import Navbar from './Navbar';

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
      element: <Welcome />
    }],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

function Layout () {
  return <>
    <Navbar />
    <Outlet />
  </>
}