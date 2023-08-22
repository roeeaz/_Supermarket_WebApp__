import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { loginAsync, selectLogged, logout as logoutLogin } from './loginSlice';
import { selectErrorMessage } from './loginSlice'; 
import { logout as logoutCart } from './cartSlice';
import './Login.css';
import UpdateDetails from './Updateuser';
import { unwrapResult } from '@reduxjs/toolkit';



const Login = () => {
    const dispatch = useAppDispatch();
    const logged = useAppSelector(selectLogged);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const errorMessage = useAppSelector(selectErrorMessage);
    
    return (
        <div>
            <div className={`${showModal ? "blur-background" : ""} main-content`}>
                <button className={logged ? "user-btn" : ""} onClick={() => setShowModal(true)}>
                    {logged ? username : "התחברות"}
                </button>
            </div>
            
            {showModal && (
                <div id="id01" className="modal">
                    <form className="modal-content animate" onSubmit={async (e) => {
                        e.preventDefault();
                        if (username && password) {
                            try {
                                const resultAction = await dispatch(loginAsync({ username, password }));
                                unwrapResult(resultAction);
                                setShowModal(false);  
                            } catch (err) {
                                
                            }
                        } else {
                            alert("Please enter username and password");
                        }
                    }}>
                        <div className="imgcontainer">
                        <span onClick={() => setShowModal(false)} className="close" title="Close Modal">&times;</span>
                            <img src="data:image/png;base64,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" alt="Avatar" className="avatar" />
                        </div>
                        <div className="container">
    <label htmlFor="uname"></label>
    <input type="text" placeholder="שם משתמש" name="uname" onChange={(e) => setUsername(e.target.value)} required />

    <label htmlFor="psw"></label>
    <input type="password" placeholder="סיסמה" name="psw" onChange={(e) => setPassword(e.target.value)} required />

    {errorMessage && <p className="error-message">{errorMessage}</p>}

    {logged ?
        <div>
            <button type="button" onClick={() => {
                dispatch(logoutLogin());
                dispatch(logoutCart());
            }}>התנתק</button>
            <UpdateDetails />
        </div>
        :
        <button type="submit">התחבר</button>
    }
</div>


                    </form>
                </div>
            )}
        </div>
    );
}

export default Login;









