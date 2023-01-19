import type { NextPage } from "next";
import Head from "next/head";
import { supaClient } from "@/lib/supabae-client";
import { ChangeEvent, FormEvent, useState } from "react";
import { useEffect } from "react";

interface CommentParams {
  id: string;
  created_at: string; // when was it posted?
  updated_at: string; 
  username: string; // Who posted it?
  payload: string; // What is the (text) content of the comment?
  reply_of?: string; // Which comment is this one replying to? This is optional
}

const Home: NextPage = () => {
  const [comment, setComment] = useState<string>("");
  const [commentList, setCommentList] = useState<CommentParams[]>([]); // Contains all column names for each object jey
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const commentValue = event.target.value;
    setComment(commentValue);
  };

  // Get comments
  const getCommentList = async () => {
    const { data, error } = await supaClient.from('comments').select('*');
    if (!error && data) { setCommentList(data); } else {
      setCommentList([]);
    }
  };

  useEffect(() => {
    getCommentList();
  }, []); // Invoked when the page is loaded

  // Handle sending comment metadata to Supabase
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(comment);

    const { data, error } = await supaClient.from('comments').insert({ // Create a new row in `comments` table
      username: username,
      payload: comment, // Rest of the data in the row/entry will have its default value (e.g. timestamp)
    });

    if (!error && data) {
      window.alert('Comment added')
    } else {
      window.alert(error?.message);
    }
  };

  return (
    <div>
      <Head><title>Comments Page</title></Head>
      <div className="pt-36 flex justify-center">
        <div className="min-w-[600px]">
          <h1 className="tex-4xl font-bold">Comments</h1>
          <form onSubmit={onSubmit} className="mt-8 flex gap-8">
            <input onChange={onChange} type="text" placeholder="Add a comment" className="p-2 border-b focus:border-b-gray-700 w-full outline-none" />
            <button className="px-4 py-2 bg-green-500 rounded-lg text-white">Submit</button>
          </form>
          <div className="flex flex-col gap-4 pt-12">
            {commentList.map((comment) => (
              <div key={comment.id} className='border rounded-md p-4'>
                <p className="font-semibold mb-2">{comment.username}</p>
                <p className="font-light">{comment.payload}</p>
              </div>
            ))};
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;