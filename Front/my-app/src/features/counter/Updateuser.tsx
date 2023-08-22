import React, { useState, useEffect } from 'react';
import {useAppDispatch } from '../../app/hooks';
import { logout, updateDetailsAsync } from './loginSlice';

const UpdateDetails = () => {
    const dispatch = useAppDispatch();
    const [newUsername, setNewUsername] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);

    useEffect(() => {
    }, [newUsername, newPassword, showModal]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (newUsername && newPassword) {
            dispatch(updateDetailsAsync({ newUsername, newPassword }))
                .then(() => {
                    dispatch(logout());
                })
                .catch(error => {
                    console.error("Error updating details:", error);
                });
            setShowModal(false);
        } else {
            alert("Please enter new username and password");
        }
    };


    return (
        <div>
            <button onClick={() => setShowModal(true)}>
                עדכן משתמש
            </button>
            {showModal && (
                <div id="id01" className="modal">
                    <span 
            className="close" 
            onClick={() => setShowModal(false)}
            style={{
                position: 'absolute',
                right: '2px',
                top: '135px',
                fontSize: '28px',
            }}
            
        >
            &times;
        </span>
                    <form className="modal-content animate" onSubmit={handleSubmit}>
                        <div className="container">
                            <label htmlFor="new_uname"></label>
                            <input
                                type="text"
                                placeholder="שם משתמש חדש"
                                name="new_uname"
                                onChange={(e) => setNewUsername(e.target.value)}
                                required
                            />
                            <label htmlFor="new_psw"></label>
                            <input
                                type="password"
                                placeholder="סיסמה חדשה"
                                name="new_psw"
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                            <button type="button" onClick={handleSubmit}>עדכן פרטים</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default UpdateDetails;
