import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';

import { getSession } from 'next-auth/react';

import axios from 'axios';
import { StyledBadge } from "../../components/style/StyledBadge"

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

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

    if (!(session.role == "manager" || session.role == "storage" || session.role == "worker")) {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
        };
    }

    const res = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/summary/user?producedBy=" + session.id);



    const data = {
        session: session,
        APIdata: res.data,
    };

    return {
        props: { data }, // will be passed to the page component as props
    };
}


const columns = [
    //   { name: "หมายเลขบัญชี", uid: "userID_usersProducer" },
    // { name: "", uid: "picture" },
    { name: "date", uid: "date" },
    { name: "constructID", uid: "constructID" },
    { name: "qcRecordID", uid: "qcRecordID" },
    { name: "status", uid: "status" },
];


const Work = ({ data }) => {
    const [items, setItems] = useState(data.APIdata.data);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const _passStatus = items.filter((item) => item.statusOverView === "Passed");
        const passStatus = _passStatus.length;

        const _failedStatus = items.filter((item) => item.statusOverView === "Failed");
        const failedStatus = _failedStatus.length;

        setChartData([passStatus, failedStatus]);
    }, [items]);
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
            <h1 className="text-xl font-bold mb-3">สถิติการทำงาน</h1>
            <div className=' p-3 flex flex-col gap-4'>

                <div className="flex w-full h-full flex-col">
                    <div className="border shadow rounded h-56 w-56 self-center p-3">
                        <Doughnut data={_data} />
                    </div>
                </div>



                {items && items.length > 0 ? (
                    <>
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
                                {items.map((item, index) => {
                                    if (item.projectName == "ไม่พบข้อมูล") return <></>;

                                    // const showDate = new Date(item.createDate);
                                    const stringDate = String(item.dateTime).split("T")[0];
                                    return (
                                        <tr key={"dataRow" + index} className="border-b">
                                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                {stringDate}

                                            </td>
                                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                {item.constructID}
                                            </td>
                                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                {item.qcRecordID}
                                            </td>

                                            <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                <StyledBadge type={item.statusOverView}>{item.statusOverView}</StyledBadge>
                                            </td>


                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </>
                ) : (<>
                    <div className="relative w-full h-[200px]">
                        <div className=" absolute top-[50%] right-[45%] text-gray-500">
                            ไม่มีประวัติการทำงาน
                        </div>
                    </div>
                </>)}


            </div>
        </Layout>
    )
}

export default Work