import React, { useContext, useMemo, useState } from "react";
import { useNavigate, redirect } from "react-router";
import { UserContext } from "./App";
import Dialog from "./Dialog";
import { supaClient } from "./supa-client";

export async function welcomeLoader() { // Prevent users from navigating to /welcome if they're not supposed to
    const { data: { user }, } = await supaClient.auth.getUser();
    if (!user) {
        return redirect('/');
    }
    
    const  { data } = await supaClient
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
    
    if (data?.username) { // If user has a username, redirect them to the homepage
        return redirect('/');
    }

    return 'Test';
}

export default function Welcome () {
    const user = useContext(UserContext);
    const navigate = useNavigate();
    const [ userName, setUserName] = useState('');
    const [serverError, setServerError] = useState('');
    const [formIsDirty, setFormIsDirty] = useState(false);
    const invalidString = useMemo(() => validateUsername(userName), [userName]);

    return (
        <Dialog
            allowClose={false}
            open={true}
            contents={
                <>
                    <h2 className="welcome-header">Welcome to the message board</h2>
                    <p className="text-center">Let's start by creating a username: </p>
                    <form className="welcome-name-form"
                        onSubmit={(event) => {
                            event.preventDefault();
                            supaClient
                                .from('user_profiles')
                                .insert([ // Insert into above table
                                    {
                                        user_id: user.session?.user.id || "", // Set to the user id that belongs to the user in session
                                        username: userName,
                                    },
                                ])
                                .then(({ error }) => {
                                    if (error) {
                                        setServerError(`Username "${userName}" is already taken`);
                                    } else { // Retrieve returned path & navigate to it
                                        const target = localStorage.getItem('returnPath') || '/';
                                        localStorage.removeItem('returnPath');
                                        navigate(target);
                                    }
                                })
                        }}
                        >
                        <input
                            name='username'
                            placeholder='Username'
                            onChange={({ target }) => {
                                setUserName(target.value);
                                if (!formIsDirty) {
                                    setFormIsDirty(true);
                                }
                                if (serverError) {
                                    setServerError('');
                                }
                            }}
                            className='welcome-name-input'></input>
                        {formIsDirty && (invalidString || serverError) && (
                            <p className="welcome-form-error-message validation-feedback">{serverError || invalidString}</p>
                        )}
                        <p className="text-center">This is the name people will see you as on the Message Board</p>
                        <button className="welcome-form-submit-button" type='submit' disabled={invalidString != null}>Submit</button>
                    </form>
                </>
            }
        />
    );
};

function validateUsername(username: string): string | undefined { // Validates form on frontend (server-side validation is dont at sql level)
    if (!username) {
        return "Username is required";
    }

    const regex = /^[a-zA-Z0-9_]+$/;
    if (username.length < 4) {
        return "Username must be at least 4 characters long";
    }

    if (!regex.test(username)) {
        return "Username can only contain letters, numbers and underscores";
    }
    return undefined;
}