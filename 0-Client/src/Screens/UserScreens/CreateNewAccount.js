import React, { useState } from 'react';
import { auth,realtimeDb } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

const CreateNewAccount = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const createNewAccount = async (e) => { // Added 'e' parameter for event
    e.preventDefault(); // Prevents the default form submission behavior

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      //console.log(userCredential.user.uid,'userID')
      const user = {
        name: "red",
        phone: "123",
        address: "4Drive",
        uid: userCredential.user.uid,
        email: userCredential.user.email
      };
     // writeUserData(user);
    } catch (error) {
      console.log(error.message);
    }
  };

  const writeUserData = () => {
    const dbRef = ref(realtimeDb, 'users/' + 'hello'); // Create a reference to the path
    console.log(dbRef)
    set(dbRef, 'hello')
      .then(() => {
        console.log('User data written successfully!');
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  return (
    <div>
      <h2>Create New Account</h2>
      <form onSubmit={createNewAccount}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Create Account</button>
        <button onClick={writeUserData}>Add Data to Database</button>

      </form>
    </div>
  );
};

export default CreateNewAccount;
