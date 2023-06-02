import Layout from "../../components/Layout";
import {
  Button,
  Checkbox,
  Input,
  Table,
  Text,
  TextInput,
  Title
} from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import Barcode from "react-barcode";
import JsBarcode from "jsbarcode";
import LoadingPage from "../../components/LoadingPage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function TestQC() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [data, setData] = useState([]);

  const [dataWithSearch, setDataWithSearch] = useState([]);
  const [search, setSearch] = useState("");
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(false);
  
  useEffect(() => {
    let newData = data.map((item) => {
      if (item.projectName.toLowerCase().includes(search.toLowerCase())) {
        return item;
      }
      if (
        String(item.LotID)
          .toLowerCase()
          .includes(search.toLowerCase() && checked4)
      ) {
        return item;
      }
      if (
        String(item.username)
          .toLowerCase()
          .includes(search.toLowerCase()) && checked3
      ) {
        return item;
      }
      if (
        String(item.constructSubID)
          .toLowerCase()
          .includes(search.toLowerCase() && checked2)
      ) {
        return item;
      }
      if (
        String(item.dateTime).toLowerCase().includes(search.toLowerCase()) && checked1
      ) {
        return item;
      }
      if (
        String(item.statusOverView).toLowerCase().includes(search.toLowerCase())
      ) {
        return item;
      }
      //if(item.people.toLowerCase().includes(search.toLowerCase()))return item;
      // if(item.people.toLowerCase().includes(search.toLowerCase()))return item;
      // if(item.username.toLowerCase().includes(search.toLowerCase()&& checked1))return item;
      return {
        projectName: "ไม่พบข้อมูล"
      };
    });
    if (newData) setDataWithSearch(newData);
  }, [search, data, checked1, checked2,checked3,checked4]);
  
/*--------------------------------------------------------------------------------------------------- */

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
  //=========================================================

  const { data: session, status } = useSession();
  const router = useRouter();

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
  // <Layout session={session}>
 //========
  return (
    <Layout session={session}>
      {!viewFullData && (
        <>
          <Title order={2} style={{ marginBottom: "15px" }}>
            การตรวจสอบคุณภาพสินค้า
          </Title>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "25px",
              marginBottom: "20px"
              // backgroundColor: "red"
            }}
          >
            <div
              style={{ display: "flex", flexDirection:"column", gap: "5px" }}
            >
              <TextInput
                placeholder="Search"
                value={search}
                onChange={(event) => setSearch(event.currentTarget.value)}
              />
              <div style={{ display: "flex", flexDirection:"row", gap: "5px" }}>
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
              </div>
            </div>
            {/* <Button
              style={{ backgroundColor: "#93C6E7" }}
              onClick={() => {
                location.href = "/test-setting";
              }}
            >
              ตั้งค่าการทดสอบ
            </Button> */}
            <button
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              style={{ backgroundColor: "#93C6E7", height: "40px" }}
              onClick={() => {
                location.href = "/test-setting";
              }}
            >
              ตั้งค่าการทดสอบ
            </button>

            {/* <Button
              style={{ backgroundColor: "#E4C988" }}
              onClick={() => {
                location.href = "/project";
              }}
            >
              โปรเจกต์การทดสอบ
            </Button> */}
            <button
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
              class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              style={{ backgroundColor: "#E4C988", height: "40px" }}
              onClick={() => {
                location.href = "/project";
              }}
            >
              โปรเจกต์การทดสอบ
            </button>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              flexDirection: "column"
              // padding: "40px"
            }}>

            <Title order={4} style={{ marginBottom: "15px" }}>
              ตารางผลการการทดสอบ
            </Title>
           <div className="overflow-x-auto">
           <table 
                className="w-full p-2 m-1 appearance-none z-10"
                css={{
                  height: "auto",
                  minWidth: "100%",
                  borderRadius: "5px"
                }}
          selectionMode="none">
              <thead style={{ backgroundColor: "#f1f3f5" }}>
                <tr>
                  <th scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      Date</th>
                  <th  scope="col"
                       class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                      Serial number</th>
                  <th scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                        Test project</th>
                  <th scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                        Overall status</th>
                  <th scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                        Tester</th>
                  <th scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                        LotID</th>
                  <th scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left">
                        More info</th>
                  {/* <th>People</th> */}
                </tr>
              </thead>
              <tbody>
                {dataWithSearch.map((item, index) => {
                  if (item.projectName == "ไม่พบข้อมูล") return <></>;
                  return (
                    <tr key={"dataRow" + index}class="border-b">
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{item.dateTime}</td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{item.constructSubID}</td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{item.projectName}</td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{item.statusOverView}</td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{item.username}</td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">{item.LotID == null && " "}</td>
                      <td>
                        <button
                          data-mdb-ripple="true"
                          data-mdb-ripple-color="light"
                          class="bg-[#45ADA8] hover:bg-[#064e3b] text-white font-bold py-2 px-4 rounded-full"
                          // style={{ backgroundColor: "#45ADA8" }}
                          onClick={() => {
                            setViewFullData({
                              constructSubID: item.constructSubID,
                              dateTime: item.dateTime,
                              projectName: item.projectName,
                              statusOverView: item.statusOverView,
                              username: item.username,
                              LotID : item.LotID
                            });
                          }}
                        >
                          more info
                        </button>
                      </td>
                      {/* <td>{item.people}</td> */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          </div>
        </>
      )}
      {viewFullData && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "20px"
            }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <Button
                style={{ backgroundColor: "#AACB73", marginRight: "20px" }}
                onClick={() => {
                  setViewFullData(null);
                }}
              >
                {"<Back"}
              </Button>
              <Title order={2}>ผลสอบคุณภาพสินค้า</Title>
              <Button
                style={{ backgroundColor: "#82AAE3", marginLeft: "auto" }}
                onClick={() => {
                  window.print();
                }}
              >
                Print
              </Button>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                padding: "40px",
                gap: "20px",
                position: "relative"
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
                  right: "-317px"
                }}
              >
                <Barcode
                  value={viewFullData.dateTime + viewFullData.constructSubID}
                />
              </div>
              <Title order={4} style={{ marginBottom: "0px" }}>
                ผลการการทดสอบความปลอดภัย
              </Title>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "30%",
                    gap: "10px"
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
                    gap: "10px"
                  }}
                >
                  <Text>{viewFullData.constructSubID}</Text>
                  <Text>{viewFullData.projectName}</Text>
                  <Text>{viewFullData.dateTime}</Text>
                  <Text>{viewFullData.statusOverView}</Text>
                  <Text>{viewFullData.username}</Text>
                  <Text>{viewFullData.LotID == null && <br></br>}</Text>
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


