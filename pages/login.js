import { signOut, signIn, useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";

import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";

import Swal from "sweetalert2";

import LoadingPage from "../components/LoadingPage";

export default function login() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  useEffect(() => {
    if (session) {
      console.log(session);

      if (status === "authenticated") {
        if (session.error === false) {
          console.log("auth complete");
          router.push("/");
          return;
        } else {
          Toast.fire({
            icon: "error",
            title: "Oops...",
            text: session.message,
          });
        }
      }
    }
    // console.log(APIdata);
  }, [status]);

  const submitContact = async (event) => {
    event.preventDefault();
    // console.log(`Username = ${event.target.name.value}?`);
    // console.log(`Password = ${event.target.password.value}?`);

    // console.log(process.env.NEXT_PUBLIC_API_URL);
    signIn("credentials", {
      username: event.target.name.value,
      password: event.target.password.value,
    });
  };

  return (
    <>
      {status == "loading" ? (
        <LoadingPage />
      ) : (
        <>
          {/*container*/}
          <div className=" bg-gray-300 h-screen items-center p-4 flex justify-center">
            {/*login card*/}

            <div className=" bg-current  flex flex-col items-center max-w-screen-lg overflow-y-hidden rounded-lg shadow-lg bg-sky-700 w-full md:flex-row">
              {/*logo*/}
              <div className=" backdrop-blur-sm backdrop-filter flex flex-col items-center justify-center p-4 text-white w-full md:w-1/2">
                <h1 className="font-medium text-3xl">ระบบจัดการคลังสินค้า</h1>
                <p className="italic text-lg">TJ-SUPPLY</p>
              </div>

              {/*form*/}

              <div className="bg-white flex flex-col items-center p-4 space-y-8 w-full md:w-1/2 border">
                <div>
                  <div className="flex flex-col items-center">
                    <h1 className="font-medium text-black text-xl">
                      ยินดีต้อนรับ
                    </h1>
                    <p>ลงชื่อเข้าใช้บัญชีของคุณ</p>
                  </div>

                  {/*inputs*/}
                  {/* onSubmit={submitContact} */}
                  <form
                    className="flex flex-col items-center space-y-4"
                    onSubmit={submitContact}
                  >
                    <div className="relative">
                      <input
                        className="text-gray-500 border bg-white shadow border-gray-300 outline-none placeholder-gray-400 pl-9 pr-4 py-1 rounded-md transition focus:ring-2 focus:ring-sky-600"
                        placeholder="ชื่อผู้ใช้งาน"
                        type="text"
                        id="name"
                        autoComplete="name"
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        className="text-gray-500 border bg-white shadow border-gray-300 outline-none placeholder-gray-400 pl-9 pr-4 py-1 rounded-md transition focus:ring-2 focus:ring-sky-600"
                        placeholder="รหัสผ่าน"
                        type="password"
                        id="password"
                        autoComplete="password"
                        required
                      />
                    </div>
                    <button
                      className=" bg-sky-700 font-medium inline-flex items-center px-3 py-1 rounded-md shadow-md text-white transition hover:bg-sky-800"
                      type="submit"
                    >
                      เข้าสู่ระบบ
                    </button>
                  </form>

                  
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
