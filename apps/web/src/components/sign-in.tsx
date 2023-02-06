/* eslint-disable @typescript-eslint/no-misused-promises */
import { signIn } from "next-auth/react";
import { FaGithub } from "react-icons/fa";

export const SignIn = () => {
  return (
    <div className="flex grow flex-col items-center justify-center">
      <div className="text-xl font-bold">Please log in below</div>
      <div className="p-4" />

      <button
        onClick={() => signIn("github")}
        className="ease flex items-center gap-4 rounded-md bg-gray-400 px-4 py-3 font-medium text-white transition duration-300 hover:bg-gray-500"
      >
        <FaGithub className="text-2xl" />
        <span>Sign in with Github</span>
      </button>
    </div>
  );
};
