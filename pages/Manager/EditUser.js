import React, { useEffect, useState } from "react";

import LoadingPage from "../../components/LoadingPage";
import Layout from "../../components/Layout";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import Swal from "sweetalert2";

import { getSession } from "next-auth/react";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  // console.log(context.query);
  // console.log(session);

  if (session == undefined) {
    return {
      redirect: {
        permanent: false,
        destination: "/api/auth/signin",
      },
    };
  }

  if (session.role != "manager") {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const sendData = { role: context.query.role, id: context.query.id };
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user/detail", {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(sendData), // body data type must match "Content-Type" header
  });

  const APIdata = await res.json();

  console.log(sendData);
  console.log(APIdata);
  if (APIdata.error == true) {
    return {
      redirect: {
        permanent: false,
        destination: "/Error",
      },
    };
  }

  const data = { session: session, APIdata: APIdata };

  return {
    props: { data }, // will be passed to the page component as props
  };
}

export default function EditUser({ data }) {
  const role = data.APIdata.data.role;
  const [gender, setGender] = useState(data.APIdata.data.gender);

  const [username, setUsername] = useState(data.APIdata.data.username);
  const [password, setPassword] = useState(data.APIdata.data.password);
  const [name, setName] = useState(data.APIdata.data.name);
  const [surname, setSurname] = useState(data.APIdata.data.surname);
  const [email, setEmail] = useState(data.APIdata.data.email);
  const [number, setNumberame] = useState(data.APIdata.data.number);
  const [address, setAddress] = useState(data.APIdata.data.address);

  const [showPassword, setShowPassword] = useState(false);

    // console.log(data)

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    // alert(`The name you entered was: ${event.target.username.value}`);
    // send data to api
    const sendData = {
      userID_usersProducer: data.APIdata.data.userID_usersProducer,
      username: event.target.username.value,
    //   password: event.target.password.value,
      name: event.target.name.value,
      surname: event.target.surname.value,
      role: role,
      email: event.target.email.value,
      gender: gender,
      number: event.target.number.value,
      address: event.target.address.value,
    };
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/user/updateDetail",
      {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(sendData), // body data type must match "Content-Type" header
      }
    );

    const APIdata = await res.json();

    if (APIdata.error == false) {
      Toast.fire({
        icon: "success",
        title: "success",
        text: "update user detail complete.",
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Oops...",
        text: APIdata.message,
      });
    }
  };

  return (
    <Layout session={data.session}>
      <div className="flex  mb-3">
        <h1 className="font-bold text-xl mr-3">แก้ไขผู้ใช้งาน</h1>
        <>
          <Menu
            as="div"
            className="relative inline-block text-left min-w-[100px] mb-3"
          >
            <div>
              <Menu.Button
                disable
                className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
              >
                {role == "worker"
                  ? "พนักงาน"
                  : role == "storage"
                  ? "ผู้ดูแลคลัง"
                  : role == "manager"
                  ? "ผู้ดูแลระบบ"
                  : ""}
                <ChevronDownIcon
                  className="ml-2 -mr-1 h-5 w-5 hover:text-violet-100"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>
          </Menu>
        </>
      </div>

      <>
        <form onSubmit={handleSubmit}>
          <div class="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                for="username"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                ชื่อบัญชี
              </label>
              <input
                type="text"
                id="username"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                }}
                required
              />
            </div>

            <div clas>
              <label
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                รหัสผ่าน
              </label>
              <div className="relative ">
                <input
                disabled
                  type={showPassword ? "text" : "password"}
                  id="password"
                  class="peer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 0"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  required
                />
                <label
                  onClick={() => setShowPassword(!showPassword)}
                  class=" absolute right-4 top-2 bg-gray-300 hover:bg-gray-400 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer "
                  for="toggle"
                >
                  {showPassword ? "hide" : "show"}
                </label>
              </div>
            </div>

            <div>
              <label
                for="name"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                ชื่อ
              </label>
              <input
                type="text"
                id="name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                required
              />
            </div>

            <div>
              <label
                for="surname"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                สกุล
              </label>
              <input
                type="text"
                id="surname"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={surname}
                onChange={(event) => {
                  setSurname(event.target.value);
                }}
                required
              />
            </div>

            <div className="flex items-center">
              <div className="grow mr-3">
                <label
                  for="email"
                  class="block mb-2 text-sm font-medium text-gray-900"
                >
                  อีเมล
                </label>
                <input
                  type="email"
                  id="email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 0"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  required
                />
              </div>
              <div className="">
                <label
                  for="gender"
                  class="block mb-2 text-sm font-medium text-gray-900"
                >
                  เพศ
                </label>

                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                      {gender == "male"
                        ? "ชาย"
                        : gender == "female"
                        ? "หญิง"
                        : gender == "etc"
                        ? "อื่นๆ"
                        : ""}
                      <ChevronDownIcon
                        className="-mr-1 ml-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              onClick={() => {
                                setGender("male");
                              }}
                            >
                              ชาย
                            </button>
                          )}
                        </Menu.Item>

                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              onClick={() => {
                                setGender("female");
                              }}
                            >
                              หญิง
                            </button>
                          )}
                        </Menu.Item>

                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-700"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                              onClick={() => {
                                setGender("etc");
                              }}
                            >
                              อื่นๆ
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>

            <div>
              <label
                for="number"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                เบอร์โทร
              </label>
              <input
                type="number"
                id="number"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 0"
                value={number}
                onChange={(event) => {
                  setNumberd(event.target.value);
                }}
                required
              />
            </div>
          </div>

          <div class="mb-6">
            <label
              for="address"
              class="block mb-2 text-sm font-medium text-gray-900"
            >
              ที่อยู่
            </label>
            <textarea
              id="address"
              rows="4"
              class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              value={address}
              onChange={(event) => {
                setAddress(event.target.value);
              }}
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </div>
        </form>
      </>
    </Layout>
  );
}
