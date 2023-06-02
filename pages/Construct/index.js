import React, { useState, useEffect } from "react";

import { getSession } from "next-auth/react";
import Layout from "../../components/Layout";
// import ConstructTable from "../components/pages/manager/ConstructTable";
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

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

// Modal.setAppElement('#yourAppElement');

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

  if ( !(session.role == "manager" || session.role == "storage"  )  ) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const sendData = {};
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/construct/list", {
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

  // if (APIdata.error == true) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/Error",
  //     },
  //   };
  // }

  const data = {
    session: session,
    APIdata: APIdata,
  };

  return {
    props: { data }, // will be passed to the page component as props
  };
}

const columns = [
  //   { name: "หมายเลขบัญชี", uid: "userID_usersProducer" },
  // { name: "", uid: "picture" },
  { name: "date", uid: "createDate" },
  { name: "serial number", uid: "constructID" },
  { name: "Lotnumber", uid: "LotID" },
  { name: "status", uid: "status" },
  { name: "actions", uid: "actions" }, // มีแค่ ดู
  // { name: "delete", uid: "delete" }, // มีแค่ ดู
];

ChartJS.register(ArcElement, Tooltip, Legend);

const Construct = ({ data }) => {
  console.log(data.APIdata);
  const [constructList, setConstructList] = useState(data.APIdata.data);
  const [dataWithSearch, setDataWithSearch] = useState([]);

  const [chartData, setChartData] = useState([]);

  const [search, setSearch] = useState("");
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);

  useEffect(() => {
    // console.log(constructList);
    let newData = constructList.map((item) => {
      // if (item.itemName.toLowerCase().includes(search.toLowerCase())) {
      //   return item;
      // }
      if (
        String(item.LotID).toLowerCase().includes(search.toLowerCase()) &&
        checked3
      ) {
        return item;
      }

      console.log(String(item.constructID));
      if (
        String(item.constructID).toLowerCase().includes(search.toLowerCase()) &&
        checked2
      ) {
        return item;
      }
      console.log(String(item.createDate));
      if (
        String(item.createDate).toLowerCase().includes(search.toLowerCase()) &&
        checked1
      ) {
        return item;
      }
      if (String(item.status).toLowerCase().includes(search.toLowerCase())) {
        return item;
      }
      return {
        projectName: "ไม่พบข้อมูล",
      };
    });
    if (newData) setDataWithSearch(newData);

    const _waitingStatus = newData.filter((item) => item.status === "waiting");
    const waitingStatus = _waitingStatus.length;

    const _finishStatus = newData.filter((item) => item.status === "finish");
    const finishStatus = _finishStatus.length;

    setChartData([waitingStatus, finishStatus]);
  }, [search, checked1, checked2, checked3]);

  const router = useRouter();

  const _data = {
    labels: ["Waiting", "Finish"],
    datasets: [
      {
        label: "# of Votes",
        data: chartData, // [12, 5],
        backgroundColor: ["rgba(255, 206, 86, 0.2)", "rgba(75, 192, 192, 0.2)"],
        borderColor: ["rgba(255, 206, 86, 1)", "rgba(75, 192, 192, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Layout session={data.session}>
      {/* <div className="flex justify-end w-full">
        <button
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          style={{ backgroundColor: "#82AAE3", marginLeft: "auto" }}
          onClick={async () => {
            var inputOptions = {}; // Define like this!

            router.push({
              pathname: "/Construct/Add",
              // query: { constructID: item.constructID },
            });

            // call API
          }}
        >
          เพิ่ม
        </button>
      </div> */}

      <Title order={2} style={{ marginBottom: "20px" }}>
        รายการรหัสสินค้า
      </Title>
      <div
      className="flex flex-row gap-[25px] mb-[20px] flex-wrap"

      >
        <div className=" mb-4" style={{ flexDirection: "column", gap: "5px" }}>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
            <label for="table-search" className="sr-only">
              Search
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
              <TextInput
                placeholder="Search"
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
              />
            </div>
          </div>
          <div
            className="mt-4"
            style={{ display: "flex", flexDirection: "row", gap: "5px" }}
          >
            <Checkbox
              label="find from date"
              color="grape"
              checked={checked1}
              onChange={(event) => setChecked1(event.currentTarget.checked)}
            />
            <Checkbox
              label="find from serial"
              color="grape"
              checked={checked2}
              onChange={(event) => setChecked2(event.currentTarget.checked)}
            />

            <Checkbox
              label="find from Lotnumber"
              color="grape"
              checked={checked3}
              onChange={(event) => setChecked3(event.currentTarget.checked)}
            />
          </div>
        </div>

        <div className="flex w-full h-full flex-col">
          <div className="border shadow rounded h-56 w-56 self-center p-3">
            <Doughnut data={_data} />
          </div>
        </div>

        {/* <button
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          style={{ backgroundColor: "#93C6E7", height: "40px" }}
          onClick={() => {
            location.href = "/test-setting";
          }}
        >
          ตั้งค่าการทดสอบ
        </button>
        <button
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          style={{ backgroundColor: "#E4C988", height: "40px" }}
          onClick={() => {
            location.href = "/project";
          }}
        >
          โปรเจกต์การทดสอบ
        </button> */}
      </div>
      <Title order={4} style={{ marginBottom: "15px" }}>
        ตารางรหัสสินค้า
      </Title>
      <table className="min-w-full overflow-auto">
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
          {dataWithSearch.map((item, index) => {
            if (item.projectName == "ไม่พบข้อมูล") return <></>;

            // const showDate = new Date(item.createDate);
            const stringDate = String(item.createDate).split("T")[0];
            return (
              <tr key={"dataRow" + index} className="border-b">
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {stringDate}
                  {/* {`${showDate.getFullYear()}-
                  ${
                    showDate.getMonth() + 1
                  }-
                  ${showDate.getDate()}`} */}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {item.constructID}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {item.LotID}
                </td>
                {/* <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {item.itemName}
                </td> */}
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <StyledBadge type={item.status}>{item.status}</StyledBadge>
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <button
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="bg-[#45ADA8] hover:bg-[#064e3b] text-white font-bold py-2 px-4 rounded-full"
                    onClick={() => {
                      router.push({
                        pathname: router.pathname + "/" + item.constructID,
                        // query: { constructID: item.constructID },
                      });
                      // setViewFullData({
                      //   constructID: item.constructID,
                      //   dateTime: item.dateTime,
                      //   projectName: item.projectName,
                      //   statusOverView: item.statusOverView,
                      //   LotID: item.LotID,
                      //   username: item.username,
                      // });
                    }}
                  >
                    more info
                  </button>
                </td>
                {/* <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <button
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className="bg-[#bc1515] hover:bg-[#80143d] text-white font-bold py-2 px-4 rounded-full"
                    onClick={async () => {
                      Swal.fire({
                        title: `Do you want to delete item\n = ${item.constructID} ?`,
                        showCancelButton: true,
                        confirmButtonText: "Delete",
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          const sendData = { constructID: item.constructID };
                          const res = await fetch(
                            process.env.NEXT_PUBLIC_API_URL + "/construct/",
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

                          const newData = constructList.filter(
                            (i) => i.constructID != item.constructID
                          );
                          setConstructList(newData);
                          setDataWithSearch(newData);
                        }
                      });
                    }}
                  >
                    DELETE
                  </button>
                </td> */}


              </tr>
            );
          })}
        </tbody>
      </table>
    </Layout>
  );
};

export default Construct;
