import React, { useEffect, useState } from "react";

import LoadingPage from "../../../components/LoadingPage";
import Layout from "../../../components/Layout";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

// import { Fragment } from "react";
// import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import Swal from "sweetalert2";

import { getSession } from "next-auth/react";
import LotTable from "../../../components/pages/manager/LotTable";

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

  // const sendData = {};
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/plan/now", {
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

  const APIdata_nowPlan = await res.json();

  if (APIdata_nowPlan.error == true) {
    return {
      redirect: {
        permanent: false,
        destination: "/Error",
      },
    };
  }

  // const sendData = {};
  const res_list = await fetch(process.env.NEXT_PUBLIC_API_URL + "/plan/list", {
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

  const APIdata_planList = await res_list.json();

  if (APIdata_planList.error == true) {
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
    APIdata_nowPlan: APIdata_nowPlan,
    APIdata_planList: APIdata_planList,
  };

  return {
    props: { data }, // will be passed to the page component as props
  };
}

const Plan = ({ data }) => {
  // const [planItemList, sePlanItemList] = useState([]);
  console.log(data);
  const [updatePlanItemTable, setUpdatePlanItemTable] = useState(false);

  const router = useRouter();

  const columns = [
    //   { name: "หมายเลขบัญชี", uid: "userID_usersProducer" },
    // { name: "", uid: "picture" },
    { name: "สิ่งของ", uid: "name" },
    { name: "สูตรการผลิต", uid: "formulaID" },
    { name: "ปัจจุบัน", uid: "amountCurrent" },
    { name: "เป้าหมาย", uid: "amountRequire" },
    // { name: "การกระทำ", uid: "actions" }, // มีแค่ ดู
  ];


  console.log(data)

  return (
    <Layout session={data.session}>
      <div className="flex flex-row justify-around mb-3">
        <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={() => {
            router.push({
              pathname: "/Manager/Plan/History",
              query: {},
            });
          }}>
          ประวัติแผนการผลิต
        </button>

        <button class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={() => {
            router.push({
              pathname: "/Manager/Plan/Add",
              query: {},
            });
          }}>
          เพิ่ม แผนการผลิต
        </button>
      </div>

      <h1 className="font-bold text-xl mb-3 min-w-full">แผนกำลังดำเนินการ</h1>

      <div className="flex flex-col gap-3">

        {
          data.APIdata_nowPlan.data && data.APIdata_nowPlan.data.map((plan, index) => {
            const startDate = new Date(plan.startDate);
            const startDate_yyyy = startDate.getFullYear();
            let startDate_mm = startDate.getMonth() + 1;
            let startDate_dd = startDate.getDate();

            const endDate = new Date(plan.endDate);
            const endDate_yyyy = endDate.getFullYear();
            let endDate_mm = endDate.getMonth() + 1;
            let endDate_dd = endDate.getDate();

            let startDateShow = `${startDate_dd}/${startDate_mm}/${startDate_yyyy}`;
            let endDateShow = `${endDate_dd}/${endDate_mm}/${endDate_yyyy}`;

            return (
              <>
                <div className="border shadow rounded-lg p-5 grid grid-cols-1 gap-3">

                  <div className="relative grid grid-cols-2 gap-3 ">
                    <p className=" font-bold text-xl">
                      [{plan.planID}] &nbsp; &nbsp;
                    </p>
                    <div className="justify-self-end">
                      <p className={(plan.status == "finish" ? "text-green-600" : plan.status == "open" ? "text-yellow-600" : "text-rose-600") + " font-bold uppercase "}>{plan.status}</p>
                    </div>
                    <div className=" flex flex-wrap flex-row flex-grow  min-w-[200px]">

                      <p>{plan.PlanName}</p>
                    </div>



                    <div className=" justify-self-end min-w-[200px]">
                      <p className=" text-gray-400 text-sm">
                        {startDateShow} - {endDateShow}
                      </p>
                    </div>

                  </div>

                  <div className=" relative p-3">
                    <h2 className="font-bold text-sm text-gray-400 mb-3">รายละเอียด</h2>
                    {plan.lotList.map((_lots, index) => (
                      <div
                        key={`plan_${plan.planID}_lot_${_lots.LotID}`}
                        className="ml-3"
                      >
                        <h3 className="font-medium mb-3"> [{_lots.LotID}] {_lots.lotName}</h3>

                        {updatePlanItemTable == true ? (
                          <LoadingPage />
                        ) : (
                          <LotTable
                            setIsLoad={() => { }}
                            session={data.session}
                            columns={columns}
                            role="Worker"
                            dataList={_lots.detail}
                            setUpdateTable={setUpdatePlanItemTable}
                            deletePath="/plan"
                          />
                        )}
                      </div>
                    ))}
                  </div>

                </div>



              </>
            );
          })
        }





      </div>
    </Layout>
  );
};

export default Plan;
