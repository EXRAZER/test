import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { useRouter } from "next/router";
import { signOut, signIn, useSession } from "next-auth/react";
import LoadingPage from "../components/LoadingPage";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // if(!status){
  //   return (<LoadingPage></LoadingPage>);
  // }
  
  // console.log(status);
  if (status === "authenticated") {

    console.log(session)
    if (session.role === "manager") {
      router.push("/UserDetail");
    } else if (session.role === "storage") {
      router.push("/UserDetail");
    } else if (session.role === "worker") {
      router.push("/UserDetail");
    } else {
      router.push("/Error");
    }

    
  }else if(status === "unauthenticated"){
    router.push("/api/auth/signin");
  }

  // return (<div>
  //   TEST
  // </div>);
}
