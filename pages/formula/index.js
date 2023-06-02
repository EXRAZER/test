import Layout from "../../components/Layout";
import {
  Button,
  Dialog,
  Group,
  Input,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingPage from "../../components/LoadingPage";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function Formula() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [data, setData] = useState([]);

  const [dataWithSearch, setDataWithSearch] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    let newData = data.map((item) => {
      if (item.formulaName.toLowerCase().includes(search.toLowerCase())) {
        return item;
      }
      if (String(item.formulaID).toLowerCase().includes(search.toLowerCase())) {
        return item;
      }
      if (String(item.itemName).toLowerCase().includes(search.toLowerCase())) {
        return item;
      }
      if (
        String(item.costFormula).toLowerCase().includes(search.toLowerCase())
      ) {
        return item;
      }
      return {
        projectName: "ไม่พบข้อมูล",
      };
    });
    if (newData) setDataWithSearch(newData);
  }, [search, data]);

  useEffect(() => {
    async function loadData() {
      const res = await axios.get(baseUrl + "/formula/list");
      setData(res.data.data);
    }
    loadData();
  }, []);
  //========
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
      if (session.error == true ) {
        router.push("/");
      }

      if ( !(session.role == "manager" || session.role == "storage"  )  ) {
        return {
          redirect: {
            permanent: false,
            destination: "/",
          },
        };
      }

    }
  }, [status]);
  // <Layout session={session}>
  //========
  return (
    <Layout session={session}>
      <Title order={2} style={{ marginBottom: "15px" }}>
        Bill of Materials
      </Title>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          marginBottom: "10px",
          // backgroundColor: "red"
        }}
      >
        {/* <button
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          style={{ backgroundColor: "#AACB73", marginRight: "10px" }}
          onClick={() => {
            location.href = "/Worker";
          }}
        >
          {"< Back"}
        </button> */}
        <TextInput
          placeholder="Search"
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
        />
        <button
          // data-mdb-ripple="true"
          // data-mdb-ripple-color="light"
          className=" ml-auto inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-700 active:shadow-lg transition duration-150 ease-in-out"
          // style={{ backgroundColor: "#82AAE3", marginLeft: "auto" }}
          onClick={() => {
            // location.href = "/formula/createFormula";
            router.push("/formula/createFormula");
          }}
        >
          สร้าง
        </button>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          // padding: "40px"
        }}
      >
        <table class="min-w-full">
          <thead class="border-b">
            <tr>
              <th
                scope="col"
                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                ID
              </th>
              <th
                scope="col"
                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                ชื่อสูตรการผลิต
              </th>
              <th
                scope="col"
                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                ชื่อสินค้า
              </th>
              <th
                scope="col"
                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                ค่าใช้จ่ายในสูตร
              </th>
              <th
                scope="col"
                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                แก้ไข
              </th>
            </tr>
          </thead>
          <tbody>
            {dataWithSearch.map((item, index) => {
              if (item.projectName == "ไม่พบข้อมูล") return <></>;
              return (
                <tr key={"dataRow" + index} class="border-b">
                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {item.formulaID}
                  </td>
                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {item.formulaName}
                  </td>
                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {item.itemName}
                  </td>
                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {/* {item.costFormula} */}
                    {(Math.round(item.costFormula * 100) / 100).toFixed(2)}
                  </td>
                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    <button
                      data-mdb-ripple="true"
                      data-mdb-ripple-color="light"
                      class="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-full"
                      // class="inline-block px-6 py-2.5 bg-rose-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-rose-700 hover:shadow-lg focus:bg-rose-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-rose-800 active:shadow-lg transition duration-150 ease-in-out"
                      // style={{ backgroundColor: "#F48484" }}
                      onClick={() => {
                        // location.href = "/formula/" + item.formulaID;
                        router.push("/formula/" + item.formulaID);
                      }}
                    >
                      แก้ไข
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
