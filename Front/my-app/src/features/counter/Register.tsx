import React, { useState, FormEvent } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { registerAsync } from './registerSlice';
import './Register.css';



interface User {
  username: string;
  password: string;
  email: string;
}

const Register: React.FC = () => {
    const dispatch = useAppDispatch();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState<string | null>(null);

    const registerUser = async (e: FormEvent) => {
      e.preventDefault();
      try {
        await dispatch(registerAsync({ username, password, email } as User)).unwrap();
        setRegisterSuccess('משתמש נרשם בהצלחה!');
      } catch (err) {
        console.error(err);
        setRegisterSuccess('הרשמה נכשלה,נסה שנית');
      }
    };

    return (
        <div>
            <button onClick={() => setShowForm(true)}>הרשמה</button>
            {showForm && (
              <div className="modal">
                <button className="close-button" onClick={() => setShowForm(false)}>X</button> 
                <form className="modal-content" onSubmit={registerUser}>
                    <div className="container">
                       

                        <label htmlFor="username"><b></b></label>
                        <input type="text" placeholder="שם משתמש" name="username" id="username" required onChange={(e)=>setUsername(e.target.value)} />

                        <label htmlFor="email"><b></b></label>
                        <input type="text" placeholder="מייל" name="email" id="email" required onChange={(e)=>setEmail(e.target.value)} />

                        <label htmlFor="psw"><b></b></label>
                        <input type="password" placeholder="סיסמה" name="psw" id="psw" required onChange={(e)=>setPassword(e.target.value)} />
                        
                        <hr />
                        {registerSuccess && <div>{registerSuccess}</div>}
                        <button type="submit" className="registerbtn">הרשמה</button>
                    </div>

                    <div className="container signin">
                        
                    </div>
                </form>
              </div>
            )}
        </div>
    );
}

export default Register;
