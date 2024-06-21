import React, { useState, useContext, useEffect } from 'react';
import { Navigate, Link } from "react-router-dom";
import { Context } from '../store/appContext';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { store, actions } = useContext(Context);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleClick = (e) => {
        e.preventDefault();
        actions.logIn(email, password);
    };

    useEffect(() => {
        if (store.isLoginSuccessful) {
            setIsLoggedIn(true);
        }
    }, [store.isLoginSuccessful]);

    if (isLoggedIn) {
        return <Navigate to="/private" />;
    }

    return (
        <div className="login-page">
            {(store.token && store.token !== "" && store.token !== undefined) ? (
                <>
                    <h1>You are logged in</h1>
                    <Link to="/private">
                        <button>Go to your Invoices</button>
                    </Link>
                </>
            ) : (
                <>
                    <div>
                        <h1>Log In</h1>
                    </div>
                    <div>
                        {store.loginMessage || ""}
                    </div>
                    <form onSubmit={handleClick}>
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
                            <button type="submit">Log In</button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};