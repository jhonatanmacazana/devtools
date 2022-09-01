import { signOut } from "next-auth/react";
import { FaCog, FaSignOutAlt } from "react-icons/fa";

import { env } from "@/env/client.mjs";

import { Link } from "./link";

export const NavButtons = () => {
  return (
    <div className="flex gap-2">
      <Link
        className="ease flex items-center gap-2 rounded-md bg-green-400 px-4 py-3 font-medium text-white transition duration-300 hover:bg-green-500"
        href={`https://github.com/settings/connections/applications/${env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`}
        isExternal
      >
        <FaCog className="text-2xl" />
        <span className="hidden md:block">Reconfigure repos access</span>
      </Link>

      <button
        onClick={() => signOut()}
        className="ease flex items-center gap-2 rounded-md bg-red-400 px-4 py-3 font-medium text-white transition duration-300 hover:bg-red-500"
      >
        <FaSignOutAlt className="text-2xl" />
        <span className="hidden md:block">Logout</span>
      </button>
    </div>
  );
};
