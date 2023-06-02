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
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import LoadingPage from "../../components/LoadingPage";

import { Chevron } from "../../components/icons";

export default function TestSetting() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [data, setData] = useState([]);

  const [dataWithSearch, setDataWithSearch] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    let newData = data.map((item) => {
      if (item.testName.toLowerCase().includes(search.toLowerCase())) {
        return item;
      }
      // if (String(item.type).toLowerCase().includes(search.toLowerCase())) {
      //   return item;
      // }
      // if (String(item.qcID).toLowerCase().includes(search.toLowerCase())) {
      //   return item;
      // }
      return {
        projectName: "ไม่พบข้อมูล",
      };
    });
    if (newData) setDataWithSearch(newData);
  }, [search, data]);

  useEffect(() => {
    async function loadData() {
      const res = await axios.get(baseUrl + "/qc/viewAllQC_main");
      setData(res.data.data);
    }
    loadData();
  }, []);
  //======

  const [opened, setOpened] = useState(false);

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

      if (!(session.role == "manager" || session.role == "storage")) {
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
      <Dialog
        opened={opened}
        withCloseButton
        onClose={() => setOpened(false)}
        size="lg"
        radius="md"
      >
        <Text size="sm" style={{ marginBottom: 10 }} weight={500}>
          Delete Complete
        </Text>
      </Dialog>
      {/* <Title order={2} style={{ marginBottom: "15px" }}>
        ตั้งค่าการทดสอบ (TestSetting)
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

        <h1 className=" font-bold text-xl">ตั้งค่าการทดสอบ (TestSetting)</h1>
      </div>

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
            location.href = "/test-qc";
          }}
        >
          {"< Back"}
        </button> */}
        <TextInput
          className=" absolute left-[50%] w-[200px] md:w-[270px]"
          placeholder="Search"
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
        />
        <button
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          class="ml-auto inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          // style={{ backgroundColor: "#82AAE3", marginLeft: "auto" }}
          onClick={() => {
            // location.href = "/test-setting/createTestSetting";
            router.push("/test-setting/createTestSetting");
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
          <thead style={{ backgroundColor: "#f1f3f5" }}>
            <tr>
              <th
                scope="col"
                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                QC ID
              </th>
              <th
                scope="col"
                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Type
              </th>
              <th
                scope="col"
                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Test name
              </th>
              <th
                scope="col"
                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Detail
              </th>
              <th
                scope="col"
                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {dataWithSearch.map((item, index) => {
              if (item.projectName == "ไม่พบข้อมูล") return <></>;
              return (
                <tr key={"dataRow" + index}>
                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {item.qcID}
                  </td>
                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {item.type}
                  </td>
                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {item.testName}
                  </td>
                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    {item.detail}
                  </td>
                  <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    <button
                      data-mdb-ripple="true"
                      data-mdb-ripple-color="light"
                      class="inline-block px-6 py-2.5 bg-rose-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-rose-700 hover:shadow-lg focus:bg-rose-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-rose-800 active:shadow-lg transition duration-150 ease-in-out"
                      // style={{ backgroundColor: "#F48484" }}
                      onClick={async () => {
                        const res = await axios.post(
                          baseUrl + "/qc/delQC_main",
                          { qcID: item.qcID }
                        );
                        const newItems = data.filter(
                          (i) => i.qcID != item.qcID
                        );
                        setData(newItems);
                        setOpened(true);
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
      </div>
    </Layout>
  );
}
