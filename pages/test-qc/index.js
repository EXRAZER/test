import Layout from "../../components/Layout";
import {
  Button,
  Checkbox,
  Input,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import Barcode from "react-barcode";
import JsBarcode from "jsbarcode";
import LoadingPage from "../../components/LoadingPage";
import { useSession, getSession } from "next-auth/react";
import { useRouter } from "next/router";

import { StyledBadge } from "../../components/style/StyledBadge";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { Chevron, Printer } from "../../components/icons"

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

  const data = {
    session: session,
  };

  return {
    props: { data }, // will be passed to the page component as props
  };
}

export default function TestQC({ data }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [dataList, setData] = useState([]);

  const [dataWithSearch, setDataWithSearch] = useState([]);
  const [datalot, setDatalot] = useState([]);
  const [search, setSearch] = useState("");
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(false);
  const [checked5, setChecked5] = useState(false);

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let newData = dataList.map((item) => {
      // console.log(item);
      if (item.projectName.toLowerCase().includes(search.toLowerCase())) {
        return item;
      }

      if (
        String(item.qcRecordID).toLowerCase().includes(search.toLowerCase()) &&
        checked5
      ) {
        return item;
      }
      if (
        String(item.LotID).toLowerCase().includes(search.toLowerCase()) &&
        checked4
      ) {
        return item;
      }
      if (
        String(item.username).toLowerCase().includes(search.toLowerCase()) &&
        checked3
      ) {
        return item;
      }
      if (
        String(item.constructID).toLowerCase().includes(search.toLowerCase()) &&
        checked2
      ) {
        return item;
      }
      if (
        String(item.dateTime).toLowerCase().includes(search.toLowerCase()) &&
        checked1
      ) {
        return item;
      }
      if (
        String(item.statusOverView).toLowerCase().includes(search.toLowerCase())
      ) {
        return item;
      }
      return {
        projectName: "ไม่พบข้อมูล",
      };
    });
    if (newData) setDataWithSearch(newData);

    const _passStatus = newData.filter((item) => item.statusOverView === "Passed");
    const passStatus = _passStatus.length;

    const _failedStatus = newData.filter((item) => item.statusOverView === "Failed");
    const failedStatus = _failedStatus.length;

    console.log(newData);

    setChartData([passStatus, failedStatus]);


  }, [search, dataList, checked1, checked2, checked3, checked4]);

  useEffect(() => {
    async function loadData() {
      const res = await axios.get(baseUrl + "/qc/viewAllTestResultSerial");
      setData(res.data.data);
    }
    loadData();
  }, []);
  const [viewFullData, setViewFullData] = useState(null);
  const [qcProjectID, setQcProjectID] = useState("");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    async function loadFulldata() {
      const res = await axios.get(baseUrl + "/qc/viewAllQc_project");
      res.data.data.forEach((item) => {
        if (item) {
          if (item.projectName === viewFullData.projectName) {
            setQcProjectID(item.qcProjectID);
            setDetail(item.detail);
          }
        }
      });
    }
    if (viewFullData) loadFulldata();
  }, [viewFullData]);


  //===== generate bercode
  const [barcodeVal, setBarcodeVal] = useState("");
  useEffect(() => {
    console.log(dataList);
    if (!viewFullData) return;
    let dd = new Date(viewFullData.dateTime);
    let newBarcode =
      // String(dd.getTime()) + "_"+
      String(Number(viewFullData.qcRecordID));
    // newBarcode = JsBarcode.getEncoding(newBarcode).data;
    for (let i = 0; i < newBarcode.length; i++) {
      try {
        newBarcode[i] = String(Number(newBarcode[i]) - 1)[0];
      } catch { }
    }
    setBarcodeVal(newBarcode);
  }, [viewFullData]);
  //====================
  // const { data: session, status } = useSession();
  const router = useRouter();

  // if (!status) {
  //   return <LoadingPage />;
  // }

  // if (status === "unauthenticated") {
  //   router.push("/api/auth/signin");
  // }

  // useEffect(() => {
  //   if (status == "authenticated") {
  //     // check if role match
  //     if (session.error == true || session.role != "manager") {
  //       router.push("/");
  //     }
  //   }
  // }, [status]);
  // <Layout session={session}>
  //========

  ChartJS.register(ArcElement, Tooltip, Legend);

  const _data = {
    labels: ["Passed", "Failed"],
    datasets: [
      {
        label: "# of Score",
        data: chartData, // [12, 5],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Layout session={data.session}>
      {!viewFullData && (
        <>
          <Title order={2} style={{ marginBottom: "20px" }}>
            การตรวจสอบคุณภาพสินค้า
          </Title>



          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "25px",
              marginBottom: "20px",
              // backgroundColor: "red"
            }}
          >
            <div
              class="mb-4 flex"
              style={{ flexDirection: "column", gap: "5px" }}
            >
              <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
                <label for="table-search" class="sr-only">
                  Search
                </label>
                <div class="relative mt-1">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
                  <TextInput
                    placeholder="Search"
                    value={search}
                    onChange={(event) => setSearch(event.currentTarget.value)}
                  />
                </div>
              </div>
              <div
                class="mt-4 flex flex-row flex-wrap gap-4"
              // style={{ display: "flex", flexDirection: "row", gap: "5px" }}
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
                  label="find from Tester"
                  color="grape"
                  checked={checked3}
                  onChange={(event) => setChecked3(event.currentTarget.checked)}
                />

                <Checkbox
                  label="find from Lotnumber"
                  color="grape"
                  checked={checked4}
                  onChange={(event) => setChecked4(event.currentTarget.checked)}
                />

                <Checkbox
                  label="find from Qc number"
                  color="grape"
                  checked={checked5}
                  onChange={(event) => setChecked5(event.currentTarget.checked)}
                />
              </div>
            </div>
            <button
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className=" h-[40px] bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-fit"
              // style={{ backgroundColor: "#93C6E7", height: "40px" }}
              onClick={() => {
                // location.href = "/test-setting";
                router.push("/test-setting");
              }}
            >
              ตั้งค่าการทดสอบ
            </button>
            <button
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              className="h-[40px] bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-full w-fit"
              // style={{ backgroundColor: "#E4C988", height: "40px" }}
              onClick={() => {
                // location.href = "/project";
                router.push("/project");
              }}
            >
              โปรเจกต์การทดสอบ
            </button>
          </div>


          <div className="flex w-full h-full flex-col">
            <div className="border shadow rounded h-56 w-56 self-center p-3">
              <Doughnut data={_data} />
            </div>
          </div>



          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              flexDirection: "column",
              // padding: "40px"
            }}
          >
            <Title order={4} style={{ marginBottom: "15px" }}>
              ตารางผลการการทดสอบ
            </Title>
            <table class="min-w-full">
              <thead style={{ backgroundColor: "#f1f3f5" }}>
                <tr>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Test project
                  </th>
                  {/* <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Qc number
                  </th> */}
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Serial number
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Overall status
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Lotnumber
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    Tester
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    More info
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataWithSearch.map((item, index) => {
                  if (item.projectName == "ไม่พบข้อมูล") return <></>;
                  return (
                    <tr key={"dataRow" + index} class="border-b">
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {String(item.dateTime).split("T")[0]}
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.projectName}
                      </td>
                      {/* <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.qcRecordID}
                      </td> */}
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.constructID}
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        <StyledBadge type={item.statusOverView}>
                          {item.statusOverView}
                        </StyledBadge>
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.LotID ? item.LotID : " - "}
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.username}
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        <button
                          data-mdb-ripple="true"
                          data-mdb-ripple-color="light"
                          class="bg-[#45ADA8] hover:bg-[#064e3b] text-white font-bold py-2 px-4 rounded-full cursor-pointer"
                          onClick={() => {
                            console.log(item);

                            setViewFullData({
                              constructID: item.constructID,
                              dateTime: item.dateTime,
                              projectName: item.projectName,
                              statusOverView: item.statusOverView,
                              LotID: item.LotID,
                              username: item.username,
                              qcRecordID: item.qcRecordID,
                            });
                          }}
                        >
                          more info
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {viewFullData && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "20px",
            }}
          >

            <div className="flex gap-3 align-middle mb-3">
              <button
                className=""
                onClick={() => {
                  setViewFullData(null);
                }}
              // onClick={() => {
              //   router.back();
              // }}
              >
                <Chevron direction="left"></Chevron>
              </button>

              <h1 className=" font-bold text-xl">ผลสอบคุณภาพสินค้า</h1>

              <div
                className="ml-auto"
                onClick={() => {
                  window.print();
                }}
              >
                <Printer isOutline={true} />

              </div>
            </div>

            {/* <div style={{ display: "flex", flexDirection: "row" }}>




              <button
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                style={{ backgroundColor: "#82AAE3", marginLeft: "auto" }}
                onClick={() => {
                  window.print();
                }}
              >
                Print
              </button>


            </div> */}



            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                padding: "40px",
                gap: "20px",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "block",
                  width: "700px",
                  height: "150px",
                  transform: "rotate(90deg) scale(0.5)",
                  position: "absolute",
                  top: "130px",
                  right: "-317px",
                }}
              >
                <Barcode value={barcodeVal} />
              </div>
              <Title order={4} style={{ marginBottom: "0px" }}>
                ผลการการทดสอบความปลอดภัย
              </Title>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "30%",
                    gap: "10px",
                  }}
                >
                  <Text>Seriral number:</Text>
                  <Text>Test Project:</Text>
                  <Text>Date:</Text>
                  <Text>Overall status:</Text>
                  <Text>Tester:</Text>
                  <Text>LotID:</Text>
                  <Text>qcProjectID:</Text>
                  <Text>Detail:</Text>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "70%",
                    gap: "10px",
                  }}
                >
                  <Text>{viewFullData.constructID}</Text>
                  <Text>{viewFullData.projectName}</Text>
                  {/* <Text>{viewFullData.dateTime}</Text> */}
                  <Text>
                    {viewFullData.dateTime
                      ? String(viewFullData.dateTime).split("T")[0]
                      : " - "}
                  </Text>

                  <Text>{viewFullData.statusOverView}</Text>
                  <Text>{viewFullData.username}</Text>
                  <Text>{viewFullData.LotID ? viewFullData.LotID : " - "}</Text>
                  <Text>{qcProjectID}</Text>
                  <Text>{detail}</Text>
                </div>
              </div>
            </div>


          </div>
        </>
      )}
    </Layout>
  );
}
