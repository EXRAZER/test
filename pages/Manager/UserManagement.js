import React, { useEffect, useState } from "react";

import LoadingPage from "../../components/LoadingPage";
import Layout from "../../components/Layout";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Image from "next/image";

import UsersTable from "../../components/pages/manager/UsersTable";
import addCircle_outline from "../../public/icons/addCircle_outline.svg";
import Swal from "sweetalert2";

const columns = [
  //   { name: "หมายเลขบัญชี", uid: "userID_usersProducer" },
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
    status: "active",
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

const UserManagement = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [workerList, setWorkerList] = useState([]);
  const [updateWorkerTable, setUpdateWorkerTable] = useState(true);

  const [storageList, setStorageList] = useState([]);
  const [updateStorageTable, setUpdateStorageTable] = useState(true);

  const [managerList, setManagerList] = useState([]);
  const [updateManagerTable, setUpdateManagerTable] = useState(true);

  const [testerList, setTesterList] = useState([]);
  const [updateTesterTable, setUpdateTesterTable] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
  }

  async function handel_getWorkerList() {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/user/worker/list"
    );

    const APIdata = await res.json();
    if (APIdata.error == false) setWorkerList(APIdata.data);
  }

  async function handel_getStorageList() {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/user/storage/list"
    );

    const APIdata = await res.json();
    if (APIdata.error == false) setStorageList(APIdata.data);
  }

  async function handel_geTesterList() {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/user/tester/list"
    );

    const APIdata = await res.json();
    if (APIdata.error == false) setTesterList(APIdata.data);
  }

  async function handel_getManagerList() {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/user/manager/list"
    );

    const APIdata = await res.json();
    if (APIdata.error == false) setManagerList(APIdata.data);
  }

  useEffect(() => {
    // if(isLoading == true){
    //     setUpdateWorkerTable(true);
    //     setUpdateStorageTable(true);
    //     setUpdateManagerTable(true);
    // }
    if (status == "authenticated") {
      // check if role match
      if (session.error == true || session.role != "manager") {
        router.push("/");
      } else {
        if (updateWorkerTable == true) {
          handel_getWorkerList();
          setUpdateWorkerTable(false);
        }

        if (updateStorageTable == true) {
          handel_getStorageList();
          setUpdateStorageTable(false);
        }

        if (updateManagerTable == true) {
          handel_getManagerList();
          setUpdateManagerTable(false);
        }

        if (updateTesterTable == true) {
          handel_geTesterList();
          setUpdateTesterTable(false);
        }
        // if(updateWorkerTable == false && updateStorageTable == false && updateManagerTable == false){
        //     setIsLoading(false);
        // }
      }
    }
  }, [
    status,
    updateWorkerTable,
    updateStorageTable,
    updateManagerTable,
    isLoading,
  ]);

  return (
    <>
      {status == "unauthenticated" || !status || isLoading == true ? (
        <LoadingPage />
      ) : (
        <Layout session={session}>
          <div className="flex flex-col gap-3 ">
            <h1 className="text-xl"> รายชื่อผู้ใช้งาน </h1>

            <>
              <div className="flex justify-between">
                <h2> รายชื่อแรงงาน </h2>
                <Image
                  className=" bg-contain rounded-full ring-2 ring-gray-100"
                  src={addCircle_outline}
                  alt="add user"
                  onClick={() => {
                    setIsLoading(true);
                    router.push({
                        pathname: "/Manager/AddUser",
                        query: { role: "worker" },
                      });
                  }}
                />
              </div>

              {updateWorkerTable == true ? (
                // <div>loading ... </div>
                <LoadingPage />
              ) : (
                <UsersTable
                  setIsLoad={setIsLoading}
                  session={session}
                  columns={columns}
                  role="Worker"
                  dataList={workerList}
                  setUpdateTable={setUpdateWorkerTable}
                  deletePath="/worker"
                />
              )}
            </>

            <>
              <div className="flex justify-between">
                <h2> รายชื่อผู้ทดสอบ </h2>
                <Image
                  className=" bg-contain rounded-full ring-2 ring-gray-100"
                  src={addCircle_outline}
                  alt="add user"
                  onClick={() => {
                    setIsLoading(true);
                    router.push({
                      pathname: "/Manager/AddUser",
                      query: { role: "tester" },
                    });
                  }}
                />
              </div>

              {updateStorageTable == true ? (
                // <div>loading ... </div>
                <LoadingPage />
              ) : (
                <UsersTable
                  setIsLoad={setIsLoading}
                  session={session}
                  columns={columns}
                  role="Tester"
                  dataList={testerList}
                  setUpdateTable={setUpdateTesterTable}
                  deletePath="/tester"
                />
              )}
            </>

            <>
              <div className="flex justify-between">
                <h2> รายชื่อผู้ดูแลคลัง </h2>
                <Image
                  className=" bg-contain rounded-full ring-2 ring-gray-100"
                  src={addCircle_outline}
                  alt="add user"
                  onClick={() => {
                    setIsLoading(true);
                    router.push({
                        pathname: "/Manager/AddUser",
                        query: { role: "storage" },
                      });
                  }}
                />
              </div>

              {updateStorageTable == true ? (
                // <div>loading ... </div>
                <LoadingPage />
              ) : (
                <UsersTable
                  setIsLoad={setIsLoading}
                  session={session}
                  columns={columns}
                  role="Storage"
                  dataList={storageList}
                  setUpdateTable={setUpdateStorageTable}
                  deletePath="/storage"
                />
              )}
            </>

            <>
              <div className="flex justify-between">
                <h2> รายชื่อผู้ดูแลระบบ </h2>
                <Image
                  className=" bg-contain rounded-full ring-2 ring-gray-100"
                  src={addCircle_outline}
                  alt="add user"
                  onClick={() => {
                    setIsLoading(true);
                    router.push({
                        pathname: "/Manager/AddUser",
                        query: { role: "manager" },
                      });
                  }}
                />
              </div>

              {updateManagerTable == true ? (
                // <div>loading ... </div>
                <LoadingPage />
              ) : (
                <UsersTable
                  setIsLoad={setUpdateManagerTable}
                  session={session}
                  columns={columns}
                  role="Manager"
                  dataList={managerList}
                  setUpdateTable={setUpdateManagerTable}
                  deletePath="/manager"
                />
              )}
            </>
          </div>
        </Layout>
      )}
    </>
  );
};

export default UserManagement;
