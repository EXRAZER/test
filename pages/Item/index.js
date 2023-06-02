import React, { useState, useEffect, useRef } from "react";

import LoadingPage from "../../components/LoadingPage";
import Layout from "../../components/Layout";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import Swal from "sweetalert2";

import { getSession } from "next-auth/react";

import star_outline from "../../public/icons/star_outline.svg";
import star_yellow_outline from "../../public/icons/star_yellow_outline.svg";
import Image from "next/image";

import { StyledBadge, Input, Spacer } from "@nextui-org/react";

import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import th from "date-fns/locale/th";

import InputField from "../../components/pages/manager/InputField";

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

  if (!(session.role == "manager" || session.role == "storage")) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const search = "";
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + `/items/list?limit=1000${search}`,
    {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      // body: JSON.stringify(sendData), // body data type must match "Content-Type" header
    }
  );

  const APIdata = await res.json();

  const data = { session: session, url: context.query, APIdata: APIdata };

  return {
    props: { data }, // will be passed to the page component as props
  };
}

const Item = ({ data }) => {
  const router = useRouter();
  registerLocale("th", th);
  const [searchTagList, setSearchTagList] = useState([]);
  const [searchField, setSearchField] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [planSelect, setPlanSelect] = useState({ id: 0, name: "ทั้งหมด" });
  const [needUpdate, setNeedUpdate] = useState(false);

  const _data = [
    {
      id: 1,
      itemID: 0,
      name: "item1",
      salePrice: 20,
      amount: 3,
      favorite: false,
    },
    {
      id: 2,
      itemID: 0,
      name: "item1",
      salePrice: 20,
      amount: 3,
      favorite: false,
    },
    {
      id: 3,
      itemID: 0,
      name: "item1",
      salePrice: 20,
      amount: 3,
      favorite: false,
    },
    {
      id: 4,
      itemID: 0,
      name: "item1",
      salePrice: 20,
      amount: 3,
      favorite: false,
    },
    {
      id: 5,
      itemID: 0,
      name: "item1",
      salePrice: 20,
      amount: 3,
      favorite: false,
    },
    {
      id: 6,
      itemID: 0,
      name: "item1",
      salePrice: 20,
      amount: 3,
      favorite: false,
    },
    {
      id: 7,
      itemID: 0,
      name: "item1",
      salePrice: 20,
      amount: 3,
      favorite: false,
    },
  ];

  const [itemList, setItemList] = useState(data.APIdata.data);
  const [searchSuggest, setSearchSuggest] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);

  let [showInfo1, setShowInfo1] = useState(false);

  // create a React ref for the dropdown element

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
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handleSearchInput = async ({ search_input = "" }) => {
    console.log("search_input");
    console.log(search_input);

    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
      "/items/suggest?limit=5&like=" +
      search_input,
      {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(sendData), // body data type must match "Content-Type" header
      }
    );

    const APIdata = await res.json();

    // console.log(APIdata);
    if (APIdata.error == false) {
      // console.log("XD");
      setSearchSuggest(APIdata.data);
    }
  };

  const handleChangeSearchInput = async (event) => {
    // var key = event.keyCode;
    // if (((key >= 65 && key <= 90) || key == 8 || key == 13) == false) {
    //   return;
    // }
    const result = event.target.value.replace(/[^a-z0-9]/gi, "");

    setSearchField(result);

    // console.log(result) ;

    handleSearchInput({ search_input: result });
  };

  const handleOnKeyDown = async (event) => {
    if (event.key === "Enter") {
      // console.log(event.target.value);
      if (event.target.value == "") {
        return;
      }

      setSearchTagList([...searchTagList, event.target.value]);
      setSearchField("");
    }
  };

  const getItemData = async () => {
    let search = "";
    for (let _ of searchTagList) {
      search += "&likes=";
      search += _;
    }

    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/items/list?limit=1000${search}`,
      {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: JSON.stringify(sendData), // body data type must match "Content-Type" header
      }
    );

    const APIdata = await res.json();

    console.log(APIdata);
    if (APIdata.error == false) {
      // console.log("XD");
      setItemList(APIdata.data);
    }

    // setNeedUpdate(false);
  };

  const updateFavoriteItem = async (data) => {
    const sendData = { itemID: data.itemID };
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/items/favorite`,
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
  };

  const ref = useRef();

  useEffect(() => {
    // window.onclick = (event) => {
    //   if (event.target.contains(ref.current) && event.target !== ref.current) {
    //     // console.log(`You clicked Outside the box!`);
    //     setShowDropdown(false);
    //   } else {
    //     // console.log(`You clicked Inside the box!`);
    //     setShowDropdown(true);
    //   }
    // };

    getItemData();
  }, [searchTagList]);

  return (
    <>
      <Layout session={data.session}>
        <div className="flex justify-end w-full">
          <button
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            style={{ backgroundColor: "#82AAE3", marginLeft: "auto" }}
            onClick={() => {
              router.push({
                pathname: "/Item/List",
                // query: { constructID: item.constructID },
              });
            }}
          >
            แก้ไข
          </button>
        </div>

        <h1 className="font-bold text-xl mr-3">รายการสิ่งของ</h1>

        <div className="flex flex-col w-full min-h-fit mb-3 gap-3 ">
          <div className="m-8 self-center w-[20%] min-w-[200px] ">
            <Input
              id="dropdownHoverButton"
              data-dropdown-toggle="dropdownHover"
              data-dropdown-trigger="hover"
              pattern="[0-9]"
              onChange={handleChangeSearchInput}
              // ref={ref}
              onClick={() => {
                setShowInfo1(true);
              }}
              onKeyDown={handleOnKeyDown}
              width="100%"
              clearable
              underlined
              labelPlaceholder="ค้นหา"
              initialValue=""
              value={searchField}
            />

            <InputField
              show={showInfo1}
              onClickOutside={() => {
                setShowInfo1(false);
              }}
              message="Click outside to close this"
            >
              <ul className="py-2 text-sm">
                {searchSuggest.map((data, index) => (
                  <li
                    onClick={() => {
                      setSearchField("");
                      setSearchTagList([...searchTagList, data.name]);
                      setSearchSuggest([]);
                    }}
                  >
                    <a href="#" className="block px-4 py-2 hover:bg-gray-300">
                      {data.name}
                    </a>
                  </li>
                ))}
              </ul>
            </InputField>
          </div>

          <div className="h-[100px]">
            <div className="flex flex-row gap-3"></div>
          </div>

          <div className="flex flex-wrap gap-1">
            {searchTagList.map((data, index) => (
              <span
                id="badge-dismiss-dark"
                className="inline-flex items-center px-2 py-1 mr-2 text-sm font-medium text-gray-800 bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-300"
              >
                {data}
                <button
                  type="button"
                  className="inline-flex items-center p-0.5 ml-2 text-sm text-gray-400 bg-transparent rounded-sm hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-gray-300"
                  data-dismiss-target="#badge-dismiss-dark"
                  aria-label="Remove"
                  onClick={() => {
                    const newList = searchTagList.filter(
                      (item) => item !== data
                    );
                    setSearchTagList(newList);
                  }}
                >
                  <svg
                    aria-hidden="true"
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Remove badge</span>
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {itemList.map((data, index) => (
            <div
              className="min-w-[260px] min-h-[140px] shadow border bg-neutral-50 p-2 rounded ring-offset-2 hover:ring-1 duration-300 hover:-translate-y-2"
              key={"item_" + data.itemID}
              onClick={() => {
                // console.log()
                router.push({
                  pathname: '/Item/Detail',
                  query: { itemID: data.itemID },
                });

              }}
            >
              <div className=" w-full h-full flex">
                {/* <div className="w-[90px] h-[90px] shadow mr-3 "> */}
                <Image
                  className=" w-[90px] h-[90px] shadow mr-3"
                  src="/item_mockUp.jpg"
                  alt="item picture"
                  width={500}
                  height={500}
                />
                {/* </div> */}
                <div className=" flex-grow">
                  <h2 className="font-bold text-sm"> {data.name}</h2>
                  <p className="text-zinc-400 text-sm">
                    {"[ " + data.itemID + " ]"}
                  </p>
                  <p className=" text-sm">
                    ราคา: {(Math.round(data.costPrice * 100) / 100).toFixed(2)}
                  </p>
                  <p className="text-sm">จำนวน: {data.amount}</p>
                </div>

                <div className="">
                  <Image
                    className=" bg-contain rounded-full ring-gray-100"
                    src={
                      data.isFavorite == true
                        ? star_yellow_outline
                        : star_outline
                    }
                    alt="add user"
                    onClick={() => {
                      console.log(data);
                      const newState = itemList.map((obj) => {
                        // 👇️ if id equals 2, update country property
                        if (obj.itemID === data.itemID) {
                          updateFavoriteItem(obj);
                          return { ...obj, isFavorite: !data.isFavorite };
                        }
                        // 👇️ otherwise return the object as is
                        return obj;
                      });
                      setItemList(newState);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Layout>
    </>
  );
};

export default Item;
