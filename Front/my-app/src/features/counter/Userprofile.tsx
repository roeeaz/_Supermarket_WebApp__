import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

const UserProfile = () => {
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  
  const token = useSelector((state: RootState) => state.login.token);


  useEffect(() => {
    axios.get('https://roee-supermarket-rol8.onrender.com/user_profile/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        setLoyaltyPoints(response.data.loyalty_points);
      })
      .catch(error => console.error('Error fetching user profile data:', error));
  }, [token]);


  return (
    <div>
      <h1>Your Profile</h1>
      <p>Loyalty Points: {loyaltyPoints}</p>
    </div>
  );
};

export default UserProfile;
