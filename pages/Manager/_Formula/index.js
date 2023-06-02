import React, { useEffect, useState } from "react";

import LoadingPage from "../../../components/LoadingPage";
import Layout from "../../../components/Layout";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import { getSession } from "next-auth/react";

import FormulaTable from "../../../components/pages/manager/FormulaTable"

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

    if (session.role != "manager") {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
        };
    }

    const sendData = {};
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/formula/list", {
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
    { name: "formula name", uid: "formulaName" },
    { name: "item", uid: "itemName" },
    { name: "amount", uid: "itemAmount" },
    // { name: "predict", uid: "predict" },
    { name: "action", uid: "actions" },
];

const FormulaHome = ({ data }) => {


    const [updateTable, setUpdateTable] = useState(true);
    const [formulaList, setFormulaList] = useState(data.APIdata.data);

    const router = useRouter();

    const getData = async () => {
        const sendData = {};
        const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/formula/list", {
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

        if(APIdata.error == false){

            setFormulaList(APIdata.data)
            setUpdateTable(false);
        }

    }

    useEffect(() => {

        if (updateTable == true) {
            getData();
        }

    }, [updateTable]);


    return (
        <Layout session={data.session}>

            <h1 className="font-bold text-xl mb-3 min-w-full">รายการสูตรการผลิต</h1>
            <div className="flex justify-end m-3">
                <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                    onClick={() => {
                        router.push({
                            pathname: "/Manager/Formula/Add",
                            query: {},
                        });
                    }}>
                    เพิ่ม สูตรการผลิต
                </button>

            </div>
            {
                updateTable == true ?
                    <LoadingPage /> :
                    <FormulaTable
                        setIsLoad={() => { }}
                        session={data.session}
                        columns={columns}

                        dataList={formulaList}
                        setUpdateTable={setUpdateTable}
                    />

            }




        </Layout>
    )
}

export default FormulaHome