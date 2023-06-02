import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { useState, useEffect, Suspense } from "react";
import LoadingPage from "../components/LoadingPage";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// function Loading({ setLoading }) {
//   const router = useRouter();

//   useEffect(() => {
//     const handleStart = (url) => setLoading(true);
//     const handleComplete = (url) => {
//       console.log("KKK");
//       setLoading(false);
//       // setTimeout(() => {
//       //   setLoading(false);
//       // }, 5000);
//     }



//     router.events.on("routeChangeStart", handleStart);
//     router.events.on("routeChangeComplete", handleComplete);
//     router.events.on("routeChangeError", handleComplete);

//     // return () => {
//     //   router.events.off("routeChangeStart", handleStart);
//     //   router.events.off("routeChangeComplete", handleComplete);
//     //   router.events.off("routeChangeError", handleComplete);
//     // };
//   });

//   return <LoadingPage />;
// }

export default function App({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeStart", (url) => {
      setLoading(true);
      // console.log("route start");
    });

    router.events.on("routeChangeComplete", (url) => {
      setLoading(false);
      // console.log("route end");

    });

    router.events.on("routeChangeError", (url) => {
      setLoading(false);
      // console.log("route error");

    });

  }, [router])



  return (
    <SessionProvider>
      {/* <Suspense fallback={<LoadingPage />}> */}
      <>
        {loading == true ? (
          // <Loading setLoading={setLoading} />


          <LoadingPage />

        ) : (
          <Component {...pageProps} />
        )}
      </>
      {/* </Suspense> */}
    </SessionProvider>
  );
}
