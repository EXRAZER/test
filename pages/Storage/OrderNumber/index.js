import React, { useState, useEffect } from "react";

import { getSession } from "next-auth/react";
import ConstructTable from "../../../components/pages/manager/ConstructTable";
import { StyledBadge } from "../../../components/style/StyledBadge";

import {
    Button,
    Checkbox,
    Input,
    Table,
    Text,
    TextInput,
    Title,
} from "@mantine/core";

import Layout from "../../../components/Layout";

import { useRouter } from "next/router";

import { NoSymbolIcon, CheckIcon } from "@heroicons/react/20/solid";
import { DeleteIcon } from "../../../components/style/DeleteIcon";
import { IconButton } from "../../../components/style/IconButton";
import Swal from "sweetalert2";

export async function getServerSideProps(context) {
    const session = await getSession(context);
    // console.log(session);

    if (session == undefined) {
        return {
            redirect: {
                permanent: false,
                destination: "/api/auth/signin",
            },
        };
    }

    if (session.role != "storage") {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
        };
    }

    const sendData = {};
    const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/items/wantBuy/all",
        {
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
        }
    );

    const APIdata = await res.json();

    if (APIdata.error == true) {
        return {
            redirect: {
                permanent: false,
                destination: "/Error",
            },
        };
    }

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
    { name: "createDate", uid: "createDate" },
    { name: "name", uid: "name" },
    { name: "amount", uid: "amount" },
    { name: "status", uid: "status" },
    { name: "costPerUnit", uid: "costPerItem" },
    // { name: "actions", uid: "actions" }, // มีแค่ ดู
];

const HomeOrderNumber = ({ data }) => {
    // console.log(data.APIdata_receiveOrder.data);

    const [dataList, setDataList] = useState(data.APIdata.data);

    const [wantApprove, setWantApprove] = useState([]);
    const [isLoadingWantApprove, setIsLoadingWantApprove] = useState(true);

    const [waitReceive, setWaitReceive] = useState([]);
    const [isLoadingWaitReceive, setIsLoadingWaitReceive] = useState(true);

    const router = useRouter();

    const getDataWaitReceiveOrder = async () => {
        const sendData = {};
        const res = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/items/wantBuy/receive",
            {
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
            }
        );

        const APIdata_receiveOrder = await res.json();

        setWaitReceive(APIdata_receiveOrder.data);
        setIsLoadingWantApprove(false);
    };

    const getDataRequestOrder = async () => {
        const sendData = {};
        const res = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/items/wantBuy/request",
            {
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
            }
        );

        const APIdata = await res.json();

        setWantApprove(APIdata.data);
        setIsLoadingWantApprove(false);
    };

    const DeleteOrder = async (orderID) => {
        const sendData = {
            orderID: orderID,
        };
        const res = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/items/wantBuy",
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

        setIsLoadingWantApprove(true);
        setIsLoadingWaitReceive(true);
    };

    const UpdateStatusAPI = async (event, status, orderID) => {
        console.log(orderID);
        let pathLink = "";
        if (status == "approve") {
            pathLink = "/items/wantBuy/approve";
        } else if (status == "deny") {
            pathLink = "/items/wantBuy/deny";
        } else if (status == "finish") {
            pathLink = "/items/wantBuy/receive";
        } else if (status == "delete") {
            DeleteOrder(orderID);
            return;
        }

        const sendData = {
            orderID: orderID,
        };
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + pathLink, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
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

        setIsLoadingWantApprove(true);
        setIsLoadingWaitReceive(true);
    };

    const getOrderTable = async () => {
        const sendData = {};
        const res = await fetch(
            process.env.NEXT_PUBLIC_API_URL + "/items/wantBuy/all",
            {
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
            }
        );

        const APIdata = await res.json();

        if (APIdata.error == false) {
            setDataList(APIdata.data);
        }
    };

    useEffect(() => {
        if (isLoadingWantApprove == true) {
            getDataRequestOrder();
            getOrderTable();
        }

        if (isLoadingWaitReceive == true) {
            getDataWaitReceiveOrder();
            getOrderTable();
        }
    }, [isLoadingWantApprove, isLoadingWaitReceive]);
    // console.log(router)

    return (
        <Layout session={data.session}>
            <div className="flex justify-end w-full">
                <button
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                    className=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                    // style={{ backgroundColor: "#82AAE3", marginLeft: "auto" }}
                    onClick={() => {
                        router.push({
                            pathname: "/Storage/OrderNumber/Add",
                            // query: { constructID: item.constructID },
                        });
                    }}
                >
                    สร้าง
                </button>
            </div>

            <Title order={2} style={{ marginBottom: "20px" }}>
                ใบสั่งซื้อสินค้า
            </Title>

            <>
                <div className="w-full min-h-[200px] mt-3 mb-3 p-3">
                    {wantApprove.length == 0 && waitReceive.length == 0 ? (
                        <div className="relative w-full h-[200px]">
                            <div className=" absolute top-[50%] right-[45%] text-gray-500">
                                ไม่มีคำขอในปัจจุบัน
                            </div>
                        </div>
                    ) : (
                        <>
                            <>
                                {wantApprove.length == 0 ? (
                                    <> </>
                                ) : (
                                    <h1 className="font-bold mb-3"> คำขอซื้อ</h1>
                                )}
                                <div className="flex flex-rol flex-wrap gap-3">
                                    {wantApprove.map((item, index) => (
                                        <div className="border bg-white min-h-[100px] min-w-[200px] rounded shadow p-2 ring-offset-2 hover:ring-1 hover:ring-sky-700 transition duration-300">
                                            <h1 className=" font-bold text-gray-500">
                                                คำสั่งซื้อ: {item.orderID}
                                            </h1>
                                            <p className="text-gray-500 text-sm">
                                                {String(item.createDate).split("T")[0]}
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                                <p className="text-gray-500 text-sm">{item.name}</p>
                                                <p className="text-gray-500 text-sm">
                                                    จำนวน: {item.amount}
                                                </p>
                                                <p>ราคา</p>
                                                <p></p>
                                                <p className="text-gray-500 text-sm">
                                                    หน่วย: {Number(item.costPerItem).toFixed(2)}
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    รวม: {item.costPerItem * item.amount}
                                                </p>
                                            </div>

                                            <div className="flex flex-row flex-wrap justify-around mt-3">
                                                <button
                                                    data-mdb-ripple="true"
                                                    data-mdb-ripple-color="light"
                                                    class="inline-block px-6 py-2.5 bg-blue-300 font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150"
                                                    onClick={(event) =>
                                                        UpdateStatusAPI(event, "deny", item.orderID)
                                                    }
                                                >
                                                    <NoSymbolIcon className="h-6 w-6 text-white" />
                                                </button>

                                                {/* <button
                                                    data-mdb-ripple="true"
                                                    data-mdb-ripple-color="light"
                                                    class="inline-block px-6 py-2.5 bg-blue-300 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-green-700 hover:shadow-lg focus:bg-green-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 "
                                                    onClick={(event) =>
                                                        UpdateStatusAPI(event, "approve", item.orderID)
                                                    }
                                                >
                                                    <CheckIcon className="h-6 w-6 text-white" />
                                                </button> */}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>

                            <>
                                {waitReceive.length == 0 ? (
                                    <> </>
                                ) : (
                                    <h1 className="font-bold mb-3 mt-3"> ตรวจรับสิ่งของ</h1>
                                )}

                                <div className="flex flex-rol flex-wrap gap-3">
                                    {waitReceive.map((item, index) => (
                                        <div className="border bg-white min-h-[100px] min-w-[200px] rounded shadow p-2 ring-offset-2 hover:ring-1 hover:ring-sky-700 transition duration-300">
                                            <h1 className=" font-bold text-gray-500">
                                                คำสั่งซื้อ: {item.orderID}
                                            </h1>
                                            <p className="text-gray-500 text-sm">
                                                {String(item.createDate).split("T")[0]}
                                            </p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                                                <p className="text-gray-500 text-sm">{item.name}</p>
                                                <p className="text-gray-500 text-sm">
                                                    จำนวน: {item.amount}
                                                </p>
                                                <p>ราคา</p>
                                                <p></p>
                                                <p className="text-gray-500 text-sm">
                                                    หน่วย: {Number(item.costPerItem).toFixed(2)}
                                                </p>
                                                <p className="text-gray-500 text-sm">
                                                    รวม: {item.costPerItem * item.amount}
                                                </p>
                                            </div>

                                            <div className="flex flex-row flex-wrap justify-around mt-3">
                                                <button
                                                    onClick={(event) => {
                                                        Swal.fire({
                                                            title: `Do you want to delete\norder number = ${item.orderID} ?`,
                                                            showCancelButton: true,
                                                            confirmButtonText: "Delete",
                                                        }).then(async (result) => {
                                                            /* Read more about isConfirmed, isDenied below */
                                                            if (result.isConfirmed) {
                                                                UpdateStatusAPI(event, "delete", item.orderID);
                                                            }
                                                        });
                                                    }}
                                                >
                                                    {/* <NoSymbolIcon className="h-6 w-6 text-white" /> */}
                                                    <IconButton>
                                                        <DeleteIcon size={20} fill="#FF0080" />
                                                    </IconButton>
                                                </button>

                                                <button
                                                    onClick={(event) => {
                                                        Swal.fire({
                                                            title: `Do you want to mark receive\norder number = ${item.orderID} ?`,
                                                            showCancelButton: true,
                                                            confirmButtonText: "Receive",
                                                        }).then(async (result) => {
                                                            /* Read more about isConfirmed, isDenied below */
                                                            if (result.isConfirmed) {
                                                                UpdateStatusAPI(event, "finish", item.orderID);
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <CheckIcon className="h-6 w-6 text-green-500 hover:text-green-700" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        </>
                    )}
                </div>
            </>

            <>
                <Title order={4} style={{ marginBottom: "15px" }}>
                    ประวัติ
                </Title>
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

                            // const showDate = new Date(item.createDate);
                            const stringDate = String(item.createDate).split("T")[0];
                            return (
                                <tr key={"dataRow" + index} className="border-b">
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                        {stringDate}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                        {item.name}
                                    </td>
                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                        {item.amount}
                                    </td>

                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                        {/* {item.status} */}
                                        <StyledBadge type={item.status}>
                                            {item.status == "finish"
                                                ? "สำเร็จ"
                                                : item.status == "denied"
                                                    ? "ปฎิเสธ"
                                                    : item.status == "allow"
                                                        ? "อนุมัติ"
                                                        : item.status == "waiting"
                                                            ? "รอ"
                                                            : item.status}
                                        </StyledBadge>
                                    </td>

                                    <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                        {Number(item.costPerItem).toFixed(2)}
                                    </td>

                                    {/* <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                    <button
                      data-mdb-ripple="true"
                      data-mdb-ripple-color="light"
                      className="bg-[#45ADA8] hover:bg-[#064e3b] text-white font-bold py-2 px-4 rounded-full"
                      onClick={() => {
                        router.push({
                          pathname: "/Manager/OrderNumber/" + item.name,
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
                  </td> */}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </>
        </Layout>
    );
};

export default HomeOrderNumber;
