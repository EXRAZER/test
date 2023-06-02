import React, {useState} from "react";

import { getSession } from "next-auth/react";
import Layout from "../../../components/Layout";
import PlanHistoryTable from "../../../components/pages/manager/PlanHistoryTable";

import { Chevron } from "../../../components/icons";
import { useRouter } from "next/router";

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
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/plan/list", {
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

const History = ({ data }) => {
  const router = useRouter();
    const columns = [
        //   { name: "หมายเลขบัญชี", uid: "userID_usersProducer" },
        // { name: "", uid: "picture" },
        { name: "วันที่สร้าง", uid: "createDate" },
        { name: "ชื่อแผน", uid: "PlanName" },
        { name: "วันเริ่มต้น", uid: "startDate" },
        { name: "วันสิ้นสุด", uid: "endDate" },
        { name: "การกระทำ", uid: "actions" }, // มีแค่ ดู
      ];

      const [planHistoryList, setPlanHistoryList] = useState(data.APIdata.data);

  return (
    <Layout session={data.session}>
      {/* <h2 className="font-bold text-xl mb-3">ประวัติแผนการผลิต</h2> */}
      
      <div className="flex gap-3 align-middle mb-3">
        <button
          className=""
          onClick={() => {
            router.back();
          }}
        >
          <Chevron direction="left"></Chevron>
        </button>

        <h1 className=" font-bold text-xl">ประวัติแผนการผลิต</h1>
      </div>

      <PlanHistoryTable
        setIsLoad={() => {}}
        session={data.session}
        columns={columns}
        role="Worker"
        dataList={planHistoryList}
        setUpdateTable={() => {}}
        deletePath="/plan"
      />
    </Layout>
  );
};

export default History;
