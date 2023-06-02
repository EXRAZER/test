import React from "react";
import {
  Navbar,
  Button,
  Link,
  Text,
  Card,
  Spacer,
  Radio,
  useTheme,
  Dropdown,
  Avatar,
} from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo.js";
import { signOut, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Men from "../../public/user/men.png";
import Image from "next/image";

export default function MyNavbar({ session }) {
  // const { data: session, status } = useSession();
  const router = useRouter();

  const [variant, setVariant] = React.useState("default");
  const [activeColor, setActiveColor] = React.useState("primary");

  const { isDark } = useTheme();

  const variants = [
    "default",
    "highlight",
    "highlight-solid",
    "underline",
    "highlight-rounded",
    "highlight-solid-rounded",
    "underline-rounded",
  ];

  const colors = ["primary", "secondary", "success", "warning", "error"];

  const handleSignOut = async (session) => {

    // send logout to API
    const sendData = {userID: session.id};
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user/logout", {
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



    signOut();
    // router.push("/api/auth/signin");
  };

  return (
    <Navbar
      isBordered={isDark}
      variant="sticky"
      className=" bg-white opacity-95 top-0"
    >
      <Navbar.Brand className="w-full ">
        <AcmeLogo />
        <Text b color="inherit" hideIn="xs">
          storage management
        </Text>
      </Navbar.Brand>
      <Navbar.Content
        activeColor={activeColor}
        hideIn="xs"
        variant={variant}
        className=""
      ></Navbar.Content>

      <Navbar.Content
        css={{
          "@xs": {
            w: "12%",
            jc: "flex-end",
          },
        }}
      >
        <Dropdown placement="bottom-right">
          <Navbar.Item>
            <Dropdown.Trigger>
              <Image
                className="bg-contain w-12 rounded-full ring-2 ring-sky-700"
                src={Men}
                alt="user picture"
              />

            </Dropdown.Trigger>
          </Navbar.Item>
          <Dropdown.Menu
            aria-label="User menu actions"
            color="secondary"
            onAction={(actionKey) => console.log({ actionKey })}
          // className="sticky"
          >
            <Dropdown.Item key="profile" css={{ height: "$18" }}>
              <Text b color="inherit" css={{ d: "flex" }}>
                สวัสดี
              </Text>
              <Text b color="inherit" css={{ d: "flex" }}>
                {!session ? "" : session.username}
              </Text>
            </Dropdown.Item>
            <Dropdown.Item key="settings" withDivider>
              การตั้งค่า
            </Dropdown.Item>
            <Dropdown.Item key="logout" withDivider color="error">
              <div onClick={() => handleSignOut(session)}>ออกจากระบบ</div>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Content>
    </Navbar>
  );
}
