import React, { useEffect, useState, useRef } from "react";

import LoadingPage from "../../../components/LoadingPage";
import Layout from "../../../components/Layout";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

// import { Fragment } from "react";
// import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import Swal from "sweetalert2";
import { Table, Row, Col, Tooltip, User, Text } from "@nextui-org/react";

import { getSession } from "next-auth/react";
import { IconButton } from "../../../components/style/IconButton";
import { DeleteIcon } from "../../../components/style/DeleteIcon";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { compareAsc, format } from "date-fns";
import { Chevron } from "../../../components/icons";


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

  // const sendData = {planID: context.query.planID};
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

  const data = {
    session: session,
    url: context.query,
    APIdata: APIdata,
  };

  return {
    props: { data }, // will be passed to the page component as props
  };
}

const Add = ({ data }) => {
  const router = useRouter();
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    // alert(`The name you entered was: ${event.target.username.value}`);
    // send data to api

    let _startDate = event.target.startDate.value.split("-");
    let _endDate = event.target.endDate.value.split("-");

    const sendData = {
      PlanName: event.target.PlanName.value,
      startDate: event.target.startDate.value,
      endDate: event.target.endDate.value,
      detail: event.target.detail.value,
      lotNames: lotNames,
    };

    console.log(lotNames);

    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/plan/", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
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

    if (APIdata.error == false) {
      Toast.fire({
        icon: "success",
        title: "success",
        text: "add new plan success.",
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Oops...",
        text: APIdata.message,
      });
    }
    // clear old data in form

    // setLotNames([
    //   {
    //     index: 0,
    //     lotName: "",
    //     detail: [
    //       { lotName: "", detail: [{ formulaID: "", amountRequire: "" }] },
    //     ],
    //   },
    // ]);


    // event.target.PlanName.value = "";
    // event.target.startDate.value = setStartDate(new Date());
    // event.target.endDate.value = setEndDate(new Date());
    // event.target.detail.value = "";
  };

  const [lotNames, setLotNames] = useState([
    // lotNames is lotNames
    {
      index: 0,
      lotName: "",
      detail: [{ lotName: "", detail: [{ formulaID: "", amountRequire: "" }] }],
    },
  ]);
  const [count, setCount] = useState(1);
  const [countLot, setCountLot] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const addInputFields = () => {
    setCount(count + 1);

    setLotNames([
      ...lotNames,
      {
        index: count,
        lotName: "",
        detail: [
          { lotName: "", detail: [{ formulaID: "", amountRequire: "" }] },
        ],
      },
    ]);

    console.log(lotNames.length);
  };

  const removeInputFields = (data) => {
    console.log(data);
    const newList = lotNames.filter((item) => item.index !== data.index);
    console.log(newList);
    setLotNames(newList);
  };

  const handleChangeLotName = (index, event) => {
    const { name, value } = event.target;
    const list = [...lotNames];

    list[index][name] = value;
    setLotNames(list);
  };

  // lot
  const addLotInputFields = (_data, lotIndex) => {
    setCountLot(countLot + 1);

    let temp = [...lotNames];
    temp.find((value, _index) => {
      if (value == _data) {
        temp[lotIndex]["detail"].push({
          formulaInLotIndex: countLot,
          formulaID: "",
          amountRequire: "",
        });

        // console.log(lotNames);
      }
    });

    setLotNames(temp);

    console.log("new");
    console.log(lotNames);
    console.log("----");
  };

  const removeLotInputFields = (searchData, lotIndex) => {
    // console.log(searchData);
    const _lotName = [...lotNames];
    const newLot = _lotName[lotIndex]["detail"].filter(
      (item) => item.formulaInLotIndex !== searchData.formulaInLotIndex
    );

    _lotName[lotIndex]["detail"] = newLot;
    // console.log(newLot);
    setLotNames(_lotName);
  };

  const handleChangeLotDetail = (event, lotIndex, ItemIndex) => {
    const { name, value } = event.target;
    const list = [...lotNames];

    list[lotIndex]["detail"][ItemIndex][name] = value;
    setLotNames(list);
  };

  return (
    <Layout session={data.session}>
      {/* <h1 className="font-bold text-xl mr-3 mb-3">เพิ่มแผนการผลิต</h1> */}

      <div className="flex gap-3 align-middle mb-3">
        <button
          className=""
          onClick={() => {
            router.back();
          }}
        >
          <Chevron direction="left"></Chevron>
        </button>

        <h1 className=" font-bold text-xl">เพิ่มแผนการผลิต</h1>
      </div>
      <>
        <form onSubmit={handleSubmit} className="mb-3">
          {/* ข้อมูลพื้นฐานของแผนการผลิต */}
          <>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div className="col-start-1 col-end-1 col-span-2">
                <label
                  htmlFor="PlanName"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  ชื่อแผนการผลิต
                </label>

                <input
                  type="text"
                  id="PlanName"
                  className=" w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                  placeholder=""
                  required
                />
              </div>
            </div>

            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div className="">
                <label
                  htmlFor="startDate"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  วันที่เริ่มต้น
                </label>

                <DatePicker
                  id="startDate"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className=" w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                />
              </div>

              <div className="">
                <label
                  htmlFor="endDate"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  วันที่สิ้นสุด
                </label>

                <DatePicker
                  id="endDate"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className=" w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                />
              </div>
            </div>

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
              placeholder="รายละเอียดของแผนการผลิต"
              required
            ></textarea>
          </>

          {/* ข้อมูลล็อตและรายละเอียด */}
          {/* lot_data คือ ข้อมูล ล็อต 1 ล็อต */}

          <div className="flex flex-col gap-3 mt-3">
            {lotNames.map((lot_data, lotIndex) => {
              const { lotName } = lot_data;
              return (
                <div className="p-3 border rounded shadow min-h-[100px] relative gap-3">
                  {/* ล็อต 1 ล็อต ประกอบด้วยชื่อ และ *รายการ*ของสูตรผลิต   */}
                  {/* {lot_data.index} */}
                  <div className="md:w-[50%]">
                    <p>ชื่อล็อตการผลิต</p>
                    <input
                      type="text"
                      name="lotName"
                      onChange={(event) => handleChangeLotName(lotIndex, event)}
                      value={lotName}
                      className=" w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                      placeholder={""}
                      required
                    />
                  </div>

                  {/* รายการสูตรการผลิตต่อ ล็อต 1 ล็อต */}
                  <div className="gap-3 grid">
                    <div className="flex w-full justify-end mt-3">
                      <button
                        type="button"
                        className="bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
                        onClick={() => addLotInputFields(lot_data, lotIndex)}
                      >
                        +
                      </button>
                    </div>
                    {lot_data.detail.map((_itemInLot, ItemIndex) => {
                      const { formulaID, amountRequire } = _itemInLot;
                      return (
                        <div
                          className="relative flex flex-row flex-wrap gap-3 justify-center"
                          key={
                            "lot_" +
                            lot_data.index +
                            "_ItemInLot_" +
                            _itemInLot.formulaInLotIndex
                          }
                        >
                          {_itemInLot.index}
                          <div className="">
                            <p>สุตรการผลิต</p>

                            <select
                              name="formulaID"
                              onChange={(event) =>
                                handleChangeLotDetail(
                                  event,
                                  lotIndex,
                                  ItemIndex
                                )
                              }
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                              required
                            >
                              <option selected="selected"></option>
                              {data.APIdata.data.map((__data, index) => (
                                <option value={__data.formulaID}>
                                  {__data.formulaName}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="">
                            <p>จำนวน</p>
                            <input
                              min="0"
                              type="number"
                              name="amountRequire"
                              onChange={(event) =>
                                handleChangeLotDetail(
                                  event,
                                  lotIndex,
                                  ItemIndex
                                )
                              }
                              value={amountRequire}
                              className=" w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                              placeholder={""}
                              required
                            />
                          </div>

                          {/* delete in item in lot */}
                          {lot_data.detail.length !== 1 ? (
                            <div className=" absolute bottom-3 right-20 ">
                              <IconButton>
                                <DeleteIcon
                                  type="button"
                                  size={20}
                                  fill="#FF0080"
                                  onClick={() =>
                                    removeLotInputFields(_itemInLot, lotIndex)
                                  }
                                />
                              </IconButton>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {lotNames.length !== 1 ? (
                    <div className=" absolute top-3 right-3">
                      <IconButton>
                        <DeleteIcon
                          type="button"
                          size={20}
                          fill="#FF0080"
                          onClick={() => removeInputFields(lot_data)}
                        />
                      </IconButton>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 mt-3">
            <div className="flex w-full justify-end">
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                onClick={addInputFields}
              >
                เพิ่มล็อตใหม่
              </button>
            </div>

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
          </div>
        </form>
      </>
    </Layout>
  );
};

export default Add;
