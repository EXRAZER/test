import {
  Button,
  Dialog,
  Input,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import LoadingPage from "../../components/LoadingPage";

import { Chevron } from "../../components/icons";
import { Disclosure } from "@headlessui/react";
import { ChevronRightIcon, ChevronUpIcon } from "@heroicons/react/20/solid";

export default function Project() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const [data, setData] = useState([]);
  const [dataWithSearch, setDataWithSearch] = useState([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    let newData = data.map((item) => {
      if (item.projectName.toLowerCase().includes(search.toLowerCase())) {
        return item;
      }
      // if (item.detail.includes(search)) {
      //   return item;
      // }
      if (
        String(item.qcProjectID).toLowerCase().includes(search.toLowerCase())
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
      const res = await axios.get(baseUrl + "/qc/viewAllQc_project");
      // viewSpecificQc_project
      let promiseArr = res.data.data.map(async (item) => {
        const newRes = await axios.post(
          baseUrl + "/qc/viewSpecificQc_project",
          {
            qcProjectID: item.qcProjectID,
          }
        );
        return {
          detail: item.detail,
          projectName: item.projectName,
          qcProjectID: item.qcProjectID,
          allQcs: newRes.data.data,
        };
      });
      const newData = await Promise.all(promiseArr);
      setData(newData);
    }
    loadData();
  }, []);

  const [opened, setOpened] = useState(false);
  const deleteProject = async (qcProjectID) => {
    setOpened(true);
    const res = await axios.post(baseUrl + "/qc/delQc_project", {
      qcProjectID: qcProjectID,
    });
  };
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
      if (session.error == true) {
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
        Test Project
      </Title> */}
      <div className="flex gap-3 align-middle mb-3">
        <button
          className=""
          onClick={() => {
            router.push("/test-qc");
          }}
        >
          <Chevron direction="left"></Chevron>
        </button>

        <h1 className=" font-bold text-xl">ชุดการทดสอบ</h1>
      </div>

      <div
        // style={{
        //   display: "flex",
        //   flexDirection: "row",
        //   gap: "20px",
        //   marginBottom: "10px",
        //   // backgroundColor: "red"
        // }}
        className="flex flex-wrap mb-[10px]"
      >
        <TextInput
          className=" absolute left-[50%] w-[200px] md:w-[270px]"
          placeholder="Search"
          value={search}
          onChange={(event) => setSearch(event.currentTarget.value)}
        />

        <button
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className=" ml-auto inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
          // style={{ backgroundColor: "#82AAE3", marginLeft: "auto" }}
          onClick={() => {
            // location.href = "/project/createProject";
            router.push("/project/createProject");
          }}
        >
          สร้าง
        </button>
      </div>

      <div
        className="flex flex-col gap-4 bg-white p-2 border rounded-lg drop-shadow-md min-h-[100px]"
      >
        {dataWithSearch && dataWithSearch.length <= 0 ? (
          <div className="flex h-[100px] justify-center">
            <p className="self-center text-gray-400"> ไม่พบข้อมูล </p>
          </div>
        ) : (
          <></>
        )}
        <>
          {dataWithSearch.map((item, index) => {
            console.log(item);
            if (item.projectName == "ไม่พบข้อมูล") return <></>;

            // if (item.allQcs.length == 0)
            return (
              <>
                {/* {item.projectName} */}
                <Disclosure>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-100 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75">
                        <span> {item.projectName} </span>
                        <ChevronUpIcon
                          className={`${
                            open ? "rotate-180 transform" : ""
                          } h-5 w-5 text-gray-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                        <div className="flex justify-end">
                          <button
                            data-mdb-ripple="true"
                            data-mdb-ripple-color="light"
                            className="  inline-block px-6 py-2.5 bg-rose-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-rose-700 hover:shadow-lg focus:bg-rose-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-rose-800 active:shadow-lg transition duration-150 ease-in-out"
                            // style={{ backgroundColor: "#F48484" }}
                            onClick={async () => {
                              await deleteProject(item.qcProjectID);
                              const newData = data.filter(
                                (i) => i.qcProjectID != item.qcProjectID
                              );
                              setOpened(true);
                              setData(newData);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                        <p className=" font-bold text-base">รายละเอียด</p>
                        <p className=" mb-3">{item.detail}</p>

                        <table className="min-w-full overflow-auto">
                          <thead style={{ backgroundColor: "#f1f3f5" }}>
                            <tr>
                              <th
                                key={"head_qcID"}
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                              >
                                qcID
                              </th>
                              <th
                                key={"head_testName"}
                                scope="col"
                                className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                              >
                                testName
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {item.allQcs.map((cell, index) => {
                              // if (item.projectName == "ไม่พบข้อมูล")
                              //   return <></>;

                              // const showDate = new Date(item.createDate);
                              // const stringDate = String(item.createDate).split(
                              //   "T"
                              // )[0];
                              return (
                                <tr
                                  key={"dataRow" + index}
                                  className="border-b"
                                >
                                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    {cell.qcID}
                                  </td>
                                  <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                    {cell.testName}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </>
            );
          })}
        </>

        {/* <table class="min-w-full">
          <thead style={{ backgroundColor: "#f1f3f5" }}>
            <tr>
              <th
                scope="col"
                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                qcProjectID
              </th>
              <th
                scope="col"
                class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
              >
                projectName
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
                qcID
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
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {dataWithSearch.map((item, index) => {
              if (item.projectName == "ไม่พบข้อมูล") return <></>;
              if (item.allQcs.length == 0)
                return (
                  <tr key={"dataRow" + index}>
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {item.qcProjectID}
                    </td>
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {item.projectName}
                    </td>
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {item.detail}
                    </td>
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      none
                    </td>
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      none
                    </td>
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      <button
                        data-mdb-ripple="true"
                        data-mdb-ripple-color="light"
                        class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                        style={{ backgroundColor: "#F48484" }}
                        onClick={async () => {
                          await deleteProject(item.qcProjectID);
                          const newData = data.filter(
                            (i) => i.qcProjectID != item.qcProjectID
                          );
                          setOpened(true);
                          setData(newData);
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              return item.allQcs.map((qc, qcIndex) => {
                return (
                  <tr key={"dataRow" + index + qcIndex} class="border-b">
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {qcIndex == 0 ? item.qcProjectID : ""}
                    </td>
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {qcIndex == 0 ? item.projectName : ""}
                    </td>
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {qcIndex == 0 ? item.detail : ""}
                    </td>
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {qc.qcID}
                    </td>
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {qc.testName}
                    </td>
                    <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                      {qcIndex == 0 ? (
                        <button
                          data-mdb-ripple="true"
                          data-mdb-ripple-color="light"
                          class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                          style={{ backgroundColor: "#F48484" }}
                          onClick={async () => {
                            await deleteProject(item.qcProjectID);
                            const newData = data.filter(
                              (i) => i.qcProjectID != item.qcProjectID
                            );
                            setOpened(true);
                            setData(newData);
                          }}
                        >
                          Delete
                        </button>
                      ) : (
                        <></>
                      )}
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table> */}
      </div>
    </Layout>
  );
}
