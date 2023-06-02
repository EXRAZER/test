import React, { useEffect, useState } from "react";


import Layout from "../../../components/Layout";


import Swal from "sweetalert2";

import { getSession } from "next-auth/react";


import { Timeline, Text } from '@mantine/core';

import { Input } from "@nextui-org/react";
import { IconButton } from "../../../components/style/IconButton";
import { DeleteIcon } from "../../../components/style/DeleteIcon";

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
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/items/suggest", {
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

const Add = ({ data }) => {

    const [count, setCount] = useState(1);
    const [inputFields, setInputFields] = useState([{
        index: count,
        toItem: "",
        amount: ""
    },]);

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

        if (APIdata.error == false) {

            setFormulaList(APIdata.data)
            setUpdateTable(false);
        }

    }


    const addInputFields = () => {
        setCount(count + 1);

        setInputFields([
            ...inputFields,
            {
                index: count,
                toItem: "",
                amount: ""
            },
        ]);

    };

    const removeInputFields = (data) => {
        // console.log(data);
        const newList = inputFields.filter((item) => item.index !== data.index);
        // console.log(newList);
        setInputFields(newList);
    };

    const handleChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...inputFields];

        list[index][name] = value;
        setInputFields(list);
    };



    return (
        <Layout session={data.session}>

            <h1 className="font-bold text-xl mb-6 min-w-full">เพิ่มสูตรการผลิต</h1>

            <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label
                        for="username"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        ชื่อสูตร
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder=""
                        required
                    />
                </div>
            </div>

            <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div>
                    <label
                        for="username"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        ผลลัพธ์
                    </label>
                    <select
                        name="formulaID"
                        // onChange={(event) => { }}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                        required
                    >

                        <option selected>

                        </option>

                        {data.APIdata.data.map((_, index) => (
                            <option value={_.itemID}>
                                {_.name}
                            </option>
                        ))}
                    </select>


                </div>

                <div>
                    <label
                        for="cost"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        ค่าใช้จ่าย
                    </label>
                    <input
                        type="number"
                        min={0}
                        id="cost"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder=""
                        required
                    />

                </div>
            </div>

            <>
                <label
                    htmlFor="detail"
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    รายละเอียด
                </label>
                <textarea
                    id="detail"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
                    placeholder=""
                    required
                ></textarea>
            </>
            <>
            </>
            <h1 className="font-bold text-xl mb-6 min-w-full mt-6">ขั้นตอนการผลิต</h1>


            <div className="flex w-full justify-end">
                <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={addInputFields}
                >
                    เพิ่มขั้นตอน
                </button>
            </div>



            <Timeline active={1}>

                {
                    inputFields.map((materia, index) => {
                        const { toItem, amount } = materia;
                        return (
                            <Timeline.Item title={"#" + (index + 1)} lineVariant="solid">
                                <div className="m-1 flex gap-3">
                                    <Input
                                        underlined
                                        labelPlaceholder=""
                                        color="default"
                                        className=""
                                        name="toItem"
                                        onChange={(event) => handleChange(index, event)}
                                        value={toItem}
                                    />

                                    <>
                                        <Text size="xs" mt={4} className="leading-9">จำนวน</Text>
                                        <Input
                                            type={"number"}
                                            underlined
                                            labelPlaceholder=""
                                            color="default"
                                            name="amount"
                                            onChange={(event) => handleChange(index, event)}
                                            value={amount} />

                                        <Text size="xs" mt={4} className="leading-9">หน่วย</Text>
                                    </>

                                    {inputFields.length !== 1 ? (
                                        <div className="flex ml-2">
                                            <IconButton>
                                                <DeleteIcon
                                                    type="button"
                                                    size={20}
                                                    fill="#FF0080"
                                                    onClick={() => removeInputFields(materia)}
                                                />
                                            </IconButton>
                                        </div>
                                    ) : (
                                        ""
                                    )}

                                </div>




                            </Timeline.Item>
                        );
                    })

                }






            </Timeline>



            {/* <div className="flex flex-col gap-3 mt-3">
                <div className="p-3 border rounded shadow min-h-[100px] relative gap-3">
                    <div>
                        <label
                            for="cost"
                            className="block mb-2 text-sm font-medium text-gray-900"
                        >
                            วัสดุ
                        </label>
                        <input
                            type="number"
                            min={0}
                            id="cost"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            placeholder=""
                            required
                        />

                    </div>

                </div>

            </div> */}

            <div className="flex w-full justify-end">
                <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                    onClick={() => {
                        // console.log(lotNames);
                    }}
                >
                    บันทึก
                </button>
            </div>



        </Layout>
    )
}

export default Add