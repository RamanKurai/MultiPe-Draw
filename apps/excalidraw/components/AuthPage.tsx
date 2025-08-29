"use client";

export default function AuthPage({ isSignin }: { isSignin: boolean }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black">
      <div className="p-8 m-4 bg-white rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-xl font-semibold text-center mb-6 bg-black">
          {isSignin ? "Sign In" : "Sign Up"}
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Email"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-600"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-600 "
          />

          <button
            className="w-full bg-blue-500 text-white rounded-md p-3 hover:bg-blue-600 transition"
            onClick={() => {}}
          >
            {isSignin ? "Sign in" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
