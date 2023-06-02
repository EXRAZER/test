import React, { useState, useMemo } from "react";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";

import { GiHamburgerMenu } from "react-icons/gi";
import { Disclosure } from "@headlessui/react";

import { signOut, signIn, useSession } from "next-auth/react";

import {
  ArticleIcon,
  CollapsIcon,
  HomeIcon,
  LogoIcon,
  LogoutIcon,
  UsersIcon,
  VideosIcon,
  Archive_outline,
  Chart_outline,
  Breaker_outline,
  Swatch_outline,
  Wrench_outline,
  Document_outline,
  Computer_outline,
} from "./icons";


function SideNavbar({ session }) {
  // const { data: session, status } = useSession();

  const [toggleCollapse, setToggleCollapse] = useState(false);
  const [isCollapsible, setIsCollapsible] = useState(false);
  // const [isMenuItems, setMenuItems] = useState([]);
  const router = useRouter();

  let MenuItems = [];

  const _menuItems = {
    "manager": [
      { id: 1, label: "ข้อมูลของฉัน", icon: HomeIcon, link: "/UserDetail" },
      { id: 2, label: "ภาพรวม", icon: Chart_outline, link: "/Manager/Summary" },
      { id: 3, label: "การกระทำ", icon: Computer_outline, link: "/Manager/UserAction" },
      { id: 4, label: "จัดการผู้ใช้", icon: UsersIcon, link: "/Manager/UserManagement" }, // ** ผู
      { id: 5, label: "กำหนดแผนการผลิต", icon: ArticleIcon, link: "/Manager/Plan" },
      { id: 6, label: "รายการสิ่งของ", icon: Archive_outline, link: "/Item" },
      { id: 7, label: "รายการสูตรการผลิต", icon: Breaker_outline, link: "/formula" },
      { id: 8, label: "รายการการผลิต", icon: Swatch_outline, link: "/Construct" },
      { id: 9, label: "การตรวจสอบ", icon: Wrench_outline, link: "/test-qc" },
      { id: 10, label: "ใบสั่งซื้อ", icon: Document_outline, link: "/Manager/OrderNumber" },

      // { id: 11, label: "การซ่อม", icon: Document_outline, link: "/Manager/OrderNumber" },

    ],
    "storage": [
      { id: 1, label: "ข้อมูลของฉัน", icon: HomeIcon, link: "/UserDetail"},
      { id: 2, label: "กำหนดแผนการผลิต", icon: ArticleIcon, link: "/Storage/Plan" },
      { id: 3, label: "รายการสิ่งของ", icon: Archive_outline, link: "/Item" },
      { id: 4, label: "รายการสูตรการผลิต", icon: Breaker_outline, link: "/formula" },
      { id: 5, label: "รายการการผลิต", icon: Swatch_outline, link: "/Construct" },
      { id: 6, label: "การตรวจสอบ", icon: Wrench_outline, link: "/test-qc" },
      { id: 7, label: "ใบสั่งซื้อ", icon: Document_outline, link: "/Storage/OrderNumber" },

    ],
    "worker": [
      { id: 1, label: "ข้อมูลของฉัน", icon: HomeIcon, link: "/UserDetail" },
      { id: 2, label: "การทำงาน", icon: Chart_outline, link: "/Worker/Work" },
      // { id: 2, label: "ข้อมูลของฉัน", icon: HomeIcon, link: "/" },
    ]
  };

  if (session && session.role != undefined && _menuItems[session.role] !== undefined) {
    MenuItems = _menuItems[session.role]; // session.level
  }


  let activeMenu = useMemo(
    () => MenuItems.find((menu) => menu.link === router.pathname), //menuItems["admin"].find((menu) => menu.link === router.pathname),
    [router.pathname]
    // if did not find menu.link === router.pathname
    // if activeMenu is empty


  );

  const wrapperClasses = classNames(
    "h-screen px-4 pt-8 pb-4 bg-stone-700 flex justify-between flex-col text-white z-10 md:z-0 absolute md:fixed",
    {
      ["w-80"]: !toggleCollapse,
      ["w-20"]: toggleCollapse,
    }
  );

  const collapseIconClasses = classNames(
    "p-4 rounded bg-light-lighter absolute right-0",
    {
      "rotate-180": toggleCollapse,
    }
  );

  // const getNavItemClasses = (menu) => {
  //   if (!activeMenu) {
  //     activeMenu = {};
  //   }
  //   console.log(activeMenu.id === menu.id);

  //   return {"flex items-center cursor-pointer hover:bg-slate-400 rounded w-full overflow-hidden whitespace-nowrap transition duration-300 ",  };
  //   // classNames(
      
  //     // {
  //     //   ["bg-light-lighter"]: activeMenu.id === menu.id,
  //     // }
  //   // );
  // };

  const onMouseOver = () => {
    setIsCollapsible(!isCollapsible);
  };

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  const handleSignOut = () => {
    signOut();
    // router.push("/");
  };


  return (

    <Disclosure as="nav" className="z-50 inline-flex items-center justify-center p-2 drop-shadow-md fixed ">
      <Disclosure.Button className=" mr-[200px] inline-flex items-center peer rounded-md absolute top-0 right-0 text-gray-800 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white group">
        <GiHamburgerMenu
          className="block md:hidden h-6 w-6 "
          aria-hidden="true"
        />
      </Disclosure.Button>

      <div className=" overflow-y-auto p-6 w-1/2 h-screen bg-stone-700 z-20 fixed top-0 -left-96 md:left-0 md:w-60  peer-focus:left-0 peer:transition ease-out delay-150 duration-200">
        <div className="flex flex-col justify-start item-center">
          <h1 className="text-base text-center cursor-pointer font-bold text-white border-b border-gray-100 pb-4 w-full">
            เมนู
          </h1>

          {isCollapsible && (
            <button
              className={collapseIconClasses}
              onClick={handleSidebarToggle}
            >
              <CollapsIcon />
            </button>
          )}
        </div>

        <div className="flex flex-col items-start mt-24 ">
          {MenuItems.map(({ icon: Icon, ...menu }) => {
            // const classes = getNavItemClasses(menu);
            return (
              <div key={"sideNavBar_" + menu.id} className={ (menu.link === router.pathname ? "bg-stone-600 " : " ") + "  flex items-center cursor-pointer rounded w-full overflow-hidden whitespace-nowrap transition duration-300 "}>
                <Link href={menu.link} className={(menu.link === router.pathname ? "text-white" : "text-stone-300 ") + "  hover:text-white flex py-4 px-3 items-center w-full h-full"}>
                  {/* <a className="flex py-4 px-3 items-center w-full h-full"> */}
                  <div style={{ width: "2.5rem" }}>
                    <Icon />
                  </div>
                  {!toggleCollapse && (
                    <p
                      // className={classNames(
                      //   "text-md font-medium text-stone-300 hover:text-white"
                      // )}
                    >
                      {menu.label}
                    </p>
                  )}

                  {/* </a> */}
                </Link>
              </div>
            );
          })}



          {/* <div className=" my-4 border-b border-gray-100 pb-4">
              <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlineSpaceDashboard className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                  Dashboard
                </h3>
              </div>
              <div className="flex  mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <CgProfile className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                  Profile
                </h3>
              </div>
              <div className="flex  mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <FaRegComments className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                  Comments
                </h3>
              </div>
              <div className="flex  mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlineAnalytics className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                  Analytics
                </h3>
              </div>
              <div className="flex  mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <BiMessageSquareDots className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                  Messages
                </h3>
              </div>
              <div className="flex  mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlineIntegrationInstructions className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                  Integration
                </h3>
              </div>
            </div> */}


          {/* setting  */}
          {/* <div className=" my-4 border-b border-gray-100 pb-4">
              <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlineSettings className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                  Settings
                </h3>
              </div>
              <div className="flex mb-2 justify-start items-center gap-4 pl-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlineMoreHoriz className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                  More
                </h3>
              </div>
            </div> */}
          {/* logout */}
          {/* <div className=" my-4">
              <div className="flex mb-2 justify-start items-center gap-4 pl-5 border border-gray-200  hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlineLogout className="text-2xl text-gray-600 group-hover:text-white " />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold ">
                  Logout
                </h3>
              </div>
            </div> */}
        </div>
      </div>
    </Disclosure>

  );
}

export default SideNavbar;
