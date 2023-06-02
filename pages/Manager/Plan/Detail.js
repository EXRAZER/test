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

  const sendData = { planID: context.query.planID };
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/plan/detail", {
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

const Detail = ({ data }) => {
  const [planItemList, sePlanItemList] = useState([]);
  const [updatePlanItemTable, setUpdatePlanItemTable] = useState(false);

  const router = useRouter();

  const columns = [
    //   { name: "หมายเลขบัญชี", uid: "userID_usersProducer" },
    // { name: "", uid: "picture" },
    { name: "ล็อตการผลิต", uid: "name" },
    { name: "สูตรการผลิต", uid: "formulaID" },
    { name: "ปัจจุบัน", uid: "amountCurrent" },
    { name: "เป้าหมาย", uid: "amountRequire" },
    // { name: "การกระทำ", uid: "actions" }, // มีแค่ ดู
  ];

  const startDate = new Date(data.APIdata.data.startDate);

  const endDate = new Date(data.APIdata.data.endDate);

  let startDateShow = `${startDate.getDate()}/${startDate.getMonth() + 1
    }/${startDate.getFullYear()}`;
  let endDateShow = `${endDate.getDate()}/${endDate.getMonth() + 1
    }/${endDate.getFullYear()}`;

  return (
    <Layout session={data.session}>
      <div className="flex gap-3 align-middle mb-3">
        <button
          className=""
          onClick={() => {
            router.back();
          }}
        >
          <Chevron direction="left"></Chevron>
        </button>

        <h1 className=" font-bold text-xl">แผนการผลิต</h1>
      </div>

      {/* <h1 className="font-bold text-xl mb-3 min-w-full">แผนการผลิต</h1> */}

      <div className="flex flex-col gap-3">
        <div className="relative grid grid-cols-2 gap-3 border shadow rounded-lg p-5">
          <div className=" flex flex-wrap flex-row flex-grow  min-w-[200px]">
            <p className="text-gray-400">
              [{data.APIdata.data.planID}] &nbsp; &nbsp;
            </p>
            <p>{data.APIdata.data.PlanName}</p>
          </div>

          <div className="justify-self-end">
            <p className={ (data.APIdata.data.status== "finish" ? "text-green-600" : data.APIdata.data.status == "open" ?"text-yellow-600" : "text-rose-600") + " font-bold uppercase "}>{data.APIdata.data.status}</p>
          </div>

          <div className=" flex flex-wrap flex-row flex-grow  min-w-[200px]">
            {/* <p className="">ระยะเวลา: &nbsp;</p> */}
            <p className=" text-gray-400 text-sm">
              {startDateShow} - {endDateShow}
            </p>
          </div>
        </div>

        <h2 className="font-bold text-xl mb-3">รายการล็อต</h2>

        {data.APIdata.data.lotList.map((_lots, index) => (
          <div
            key={`plan_${data.APIdata.data.planID}_lot_${_lots.LotID}`}
            className="ml-3"
          >
            <h3 className="font-medium mb-3">{_lots.lotName}</h3>

            {updatePlanItemTable == true ? (
              // <div>loading ... </div>
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
    </Layout>
  );
};

export default Detail;
