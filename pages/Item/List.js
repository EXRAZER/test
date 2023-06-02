import React, { useState, useEffect } from "react";

import { getSession } from "next-auth/react";
import Layout from "../../components/Layout";
import ConstructTable from "../../components/pages/manager/ConstructTable";
import { StyledBadge } from "../../components/style/StyledBadge";

import {
  Button,
  Checkbox,
  Input,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import { useRouter } from "next/router";

import Swal from "sweetalert2";
import axios from "axios";

import { Chevron } from "../../components/icons";
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

  if ( !(session.role == "manager" || session.role == "storage"  ) ) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const sendData = {};
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/items/list", {
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
  });

  const APIdata = await res.json();

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

const columns = [
  //   { name: "หมายเลขบัญชี", uid: "userID_usersProducer" },
  // { name: "", uid: "picture" },
  { name: "name", uid: "name" },
  { name: "amount", uid: "amount" },
  { name: "costPrice", uid: "costPrice" },
  { name: "detail", uid: "detail" },
  { name: "action", uid: "action" },
];

const List = ({ data }) => {
  const router = useRouter();
  const [dataList, setDataList] = useState(data.APIdata.data);

  return (
    <Layout session={data.session}>
      {/* <Title order={4} style={{ marginBottom: "15px" }}>
        รวมรายการสิ่งของ
      </Title> */}

      <div className="flex gap-3 align-middle mb-3">
        <button
          className=""
          onClick={() => {
            router.back();
          }}
        >
          <Chevron direction="left"></Chevron>
        </button>

        <h1 className=" font-bold text-xl">รวมรายการสิ่งของ</h1>
      </div>

      <div className="flex justify-end w-full mb-3 mt-3">
        <button
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          // style={{ backgroundColor: "#82AAE3", marginLeft: "auto" }}
          onClick={() => {
            router.push({
              pathname: "/Item/Add",
              // query: { constructID: item.constructID },
            });
          }}
        >
          สร้าง
        </button>
      </div>

      <table className="min-w-full">
        <thead style={{ backgroundColor: "#f1f3f5" }}>
          <tr>
            {columns.map((head, index) => (
              <th
                key={head.uid}
                scope="col"
                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                {head.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataList.map((item, index) => {
            if (item.projectName == "ไม่พบข้อมูล") return <></>;

            return (
              <tr key={"dataRow" + index} className="border-b">
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {item.name}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {item.amount}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {Number(item.costPrice).toFixed(2)}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {item.detail}
                </td>
                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <button
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    class="inline-block px-6 py-2.5 bg-rose-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-rose-700 hover:shadow-lg focus:bg-rose-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-rose-800 active:shadow-lg transition duration-150 ease-in-out"
                    // style={{ backgroundColor: "#F48484" }}
                    onClick={async () => {
                      console.log(item.itemID);
                      Swal.fire({
                        title: `Do you want to delete item\n = ${item.name} ?`,
                        showCancelButton: true,
                        confirmButtonText: "Delete",
                      }).then(async (result) => {
                        /* Read more about isConfirmed, isDenied below */
                        if (result.isConfirmed) {
                          Swal.fire({
                            title: `THIS ACTION WILL PERMANENT LOSE [${item.name}] AND ASSOCIATE DATA \n CONTINUE ?`,
                            showCancelButton: true,
                            confirmButtonText: "Delete",
                          }).then(async (result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                              //   UpdateStatusAPI(event, "delete", item.orderID);

                              const sendData = { itemID: item.itemID };
                              const res = await fetch(
                                process.env.NEXT_PUBLIC_API_URL + "/items/",
                                {
                                  method: "DELETE", // *GET, POST, PUT, DELETE, etc.
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

                              console.log(APIdata.message);
                              const newItems = dataList.filter(
                                (i) => i.itemID != item.itemID
                              );
                              setDataList(newItems);
                            }
                          });
                        }
                      });

                      // window.location.reload();
                    }}
                  >
                    delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Layout>
  );
};

export default List;
