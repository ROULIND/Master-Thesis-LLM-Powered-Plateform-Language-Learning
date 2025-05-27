import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';

const UserInfo = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
        setUser(user);
        console.log('User logged in:', user.uid, user.email);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  console.log(user)

  return (
    <div>
      {user && (
        <div>
          <h2>Welcome, {user.email}!</h2>
          <p>UID: {user.uid}</p>
          <p>UID:</p>

        </div>
      )}
    </div>
  );
};

export default UserInfo;
