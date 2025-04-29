import React, { useState } from 'react';
import { createUser } from '../utils/api';
import FormPage from './FormPage';

const Login = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [name, setName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(rollNumber, name);
      setIsLoggedIn(true);
    } catch (error) {
      alert('Login failed!');
    }
  };

  if (isLoggedIn) {
    return <FormPage rollNumber={rollNumber} />;
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Student Login</h2>
        <input
          type="text"
          placeholder="Roll Number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;