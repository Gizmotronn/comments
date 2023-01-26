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

interface EditCommentParams {
  id: string;
  payload: string;
}

const Home: NextPage = () => {
  const [comment, setComment] = useState<string>("");
  const [commentList, setCommentList] = useState<CommentParams[]>([]); // Contains all column names for each object jey
  const [editComment, setEditComment] = useState<EditCommentParams>({ id: '', payload: '', });
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const commentValue = event.target.value;
    setComment(commentValue);
  };

  // Event for when a comment is edited
  const onChangeEditComment = (event: ChangeEvent<HTMLInputElement>) => {
    const payload = event.target.value;
    setEditComment({ ...editComment, payload });
  };

  const confirmEdit = async () => { // Send updated/edited comment to Supabase
    const { data, error } = await supaClient
      .from('comments')
      .update({ payload: editComment.payload, }) // Update data on the Supabase entry
      .match({ id: editComment.payload}); // The `updated_at` field is updated through an SQL query on Supabase, not client-side
    if ( !error && data ) {
      window.alert('error'); // should be `error?message`
    }
  };

  // Deleting a comment | Event
  const confirmDelete = async (id: string) => {
    const ok = window.confirm("Delete comment?");
    if (ok) {
      const { data, error } = await supaClient.from('comments').delete().match({ id });
      if (!error && data) {
        window.alert('Deleted comment :)');
      } else {
        window.alert(error?.message);
      }
    }
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
            {commentList
              .sort((a, b) => { // Sort the comments by the date they were last updated
                const aDate = new Date(a.created_at);
                const bDate = new Date(b.created_at);
                return +aDate - +bDate;
              })
              .map((comment) => (
                <div key={comment.id} className='border rounded-md p-4'>
                  <p className='font-semibold mb-2'>
                    {comment.username}
                    {comment.updated_at !== comment.created_at && (
                      <span className="ml-4 text-sm italic font-extralight">edited</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 justify-between">
                    {comment.id === editComment.id ? (
                      <input
                        type='text'
                        value={editComment.payload}
                        onChange={onChangeEditComment}
                        className='pb-1 border-b w-full'
                      />
                    ) : (
                      <p className="font-light">{comment.payload}</p>
                    )};
                    {editComment.id === comment.id ? (
                      <>
                        <button
                          type='button'
                          onClick={confirmEdit}
                          disabled={editComment.payload === comment.payload} // Don't allow a user to edit the post if it hasn't been changed
                          title="Confirm"
                        >Confirm</button>
                        <div className="flex gap-2">
                          <button type='button'
                            onClick={() => setEditComment({ id: '', payload: '' })}
                            className='text-gray-500'
                          >Cancel</button>
                        </div>
                      </>
                    ) : (
                      <>
                        <button
                          type='button'
                          onClick={() => setEditComment({ id: comment.id, payload: comment.payload })}
                          className='text-green-500'
                        >
                          Edit
                        </button>
                        <button
                          type='button'
                          onClick={() => confirmDelete(comment.id)}
                          className='text-gray-700'>Delete</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;