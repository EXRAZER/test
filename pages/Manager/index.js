import React, { useEffect, useState } from "react";

import LoadingPage from "../../components/LoadingPage";
import Layout from "../../components/Layout";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";

import UsersTable from "../../components/pages/manager/UsersTable";
import addCircle_outline from "../../public/icons/addCircle_outline.svg";

const columns = [
  { name: "หมายเลขบัญชี", uid: "userID_usersProducer" },
  // { name: "", uid: "picture" },
  { name: "ชื่อผู้ใช้", uid: "username" },
  { name: "สถานะ", uid: "status" },
  { name: "การกระทำ", uid: "actions" },
];

const _data = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Technical Lead",
    team: "Development",
    status: "paused",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    role: "Senior Developer",
    team: "Development",
    status: "active",
    age: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "William Howard",
    role: "Community Manager",
    team: "Marketing",
    status: "vacation",
    age: "28",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    name: "Kristen Copper",
    role: "Sales Manager",
    team: "Sales",
    status: "active",
    age: "24",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
];

const Home_Manager = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [updateStudentTable, setUpdateStudentTable] = useState(false);

  if (!status) {
    return <LoadingPage />;
  }

  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
  }

  useEffect(() => {
    if (status == "authenticated") {
      // check if role match
      if (session.error == true || session.role != "manager") {
        router.push("/");
      }
    }
  }, [status]);

  return (
    // summary detail page
    <Layout session={session}>
      <div className="flex flex-col gap-3 "></div>
    </Layout>
  );
};

export default Home_Manager;
