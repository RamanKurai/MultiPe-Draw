import React, { useState } from "react";

const SignUpComponent = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e : any) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !password) {
      alert("Fill all fields");
      return;
    }

    // Here you will call API later
    console.log("Signup Data:", { name, email, password });
  };

  return (
    <div className="bg-slate-700 min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-80 space-y-4"
      >
        <input
          type="text"
          placeholder="Enter Your Name"
          className="border p-2 w-full rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Enter Your Email"
          className="border p-2 w-full rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter Your Password"
          className="border p-2 w-full rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpComponent;
