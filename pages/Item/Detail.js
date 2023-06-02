import React from 'react'
import { getSession } from 'next-auth/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { Chevron } from '../../components/icons';
import { StyledBadge } from "../../components/style/StyledBadge";
import { format } from 'date-fns';

export async function getServerSideProps(context) {
    const session = await getSession(context);

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

    const res = await axios.get(
        process.env.NEXT_PUBLIC_API_URL + "/items/construct/listInItemID", {
        params: {
            itemID: context.query.itemID
        }
    }
    );

    if (!res) {
        res["data"] = { data: [] };
    }

    const data = {
        session: session,
        url: context.query,
        dataAPI: res.data.data,
    };

    return {
        props: { data }, // will be passed to the page component as props
    };
}



const DetailItem = ({ data }) => {
    console.log(data);

    const router = useRouter();


    return (
        <Layout session={data.session}>
            <div className="flex gap-3 mb-3">
                <button
                    className=""
                    onClick={() => {
                        // router.push("/Campaign");
                        router.back();
                    }}
                >
                    <Chevron direction="left"></Chevron>
                </button>

                <h1 className="font-bold text-xl"> รายการการผลิตสินค้า { } </h1>
            </div>
            <>
                {/* TABLE */}
                {
                    data.dataAPI && data.dataAPI.length > 0 ?
                        <>
                            <table class="min-w-full">
                                <thead style={{ backgroundColor: "#f1f3f5" }}>
                                    <tr>
                                        <th
                                            scope="col"
                                            class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                        >
                                            createDate
                                        </th>
                                        <th
                                            scope="col"
                                            class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                        >
                                            Lot Name
                                        </th>
                                        <th
                                            scope="col"
                                            class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                        >
                                            constructID
                                        </th>
                                        <th
                                            scope="col"
                                            class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                                        >
                                            status
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
                                    {data.dataAPI.map((item, index) => {
                                        if (item.projectName == "ไม่พบข้อมูล") return <></>;
                                        return (
                                            <tr key={"dataRow" + index} class="border-b">
                                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                    {format(new Date(item.createDate), 'dd/MM/yyyy')}
                                                    {/* {String(item.createDate).split("T")[0]} */}
                                                </td>
                                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                    {item.lotName}
                                                </td>
                                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                    {item.constructID}
                                                </td>
                                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                    <StyledBadge type={item.status}>
                                                        {item.status}
                                                    </StyledBadge>
                                                </td>
                                                <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        data-mdb-ripple="true"
                                                        data-mdb-ripple-color="light"
                                                        class="bg-[#45ADA8] hover:bg-[#064e3b] text-white font-bold py-2 px-4 rounded-full cursor-pointer"
                                                        onClick={() => {
                                                            // console.log(item);
                                                            router.push(
                                                                {
                                                                    pathname: "/Construct/[constructID]",
                                                                    query: { constructID: item.constructID },
                                                                }
                                                            );
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
                        </>
                        :
                        <>
                            <div className=" w-[100%] h-[20vh] flex justify-center  rounded mt-3 mb-3">
                                <div className=" self-center text-center ">
                                    <p className="text-sm text-gray-400">
                                        ยังไม่มีรายการการผลิต
                                    </p>
                                </div>
                            </div>
                        </>

                }

            </>
        </Layout>

    )
}

export default DetailItem