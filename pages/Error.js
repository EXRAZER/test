import React from "react";

import Image from "next/image";
import { signOut, signIn, useSession } from "next-auth/react";
import LoadingPage from "../components/LoadingPage";
import { useRouter } from "next/router";

const Error = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if(!status){
    return (<LoadingPage></LoadingPage>);
  }
  
  if(status === "unauthenticated"){
    router.push("/api/auth/signin");
  }

  // in case error page select two option
  // - logout
  // - go to home page

  return (
    <div className="flex flex-col min-h-screen justify-center items-center gap-3">
      <div className="flex flex-col">
        <Image priority={true} className="self-center" src="/cat_error.gif" alt="error gif" height={100} width={100} />
        <h1 className="text-gray-500 font-bold text-xl text-center">Oh no</h1>
        <p className="">Something went wrong.</p>

      </div>
      <div className="flex flex-col gap-2">
        <button class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" onClick={()=>{ router.push("/");}}>
          Home page
        </button>

        <button
          class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          onClick={() => {
            signOut();
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Error;
