// #work on the front end
// # 1. create 3 new pages: /Signup, /Login, /Private
// #2. create the necessary inputs needed for signup.js and login.js
// #3. make sure that they are controlled inputs (useState)
// #4.include useContext and Context for flux applications
// #5.update flux.js to have token, message, invoices in the store!
// #6. update and test actions to be able to retrieve a token and save it in localStorage

import React, { useState, useContext, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom"
import { Context } from '../store/appContext';
  


export const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {store, actions} = useContext(Context);


    const handleClick = () => {
        actions.signUp(email, password)

    }
useEffect(() => {
    if(store.isSignUpSuccessful) {
        Navigate("/login")
    }
   
}, [store.isSignUpSuccessful])

    return (
        <>
       <div className="signup-page">
        <div>
            <h1>Sign Up</h1>
        </div>
        <div>
            {store.signupMessage || ""}
        </div>
        <div>
            <input 
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            />
            <input 
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required

            />
        </div>
        <div>
            <button
            onClick={handleClick}
            >Sign Up</button>
        </div>




       </div>
        </>
    );
}