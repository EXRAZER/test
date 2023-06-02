import { useRouter } from "next/router";
import Layout from "../../../../components/Layout";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession, getSession } from "next-auth/react";

// import { StyledBadge } from "../../../components/style/StyledBadge";
import { Chevron } from "../../../../components/icons"


export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log(context.query);

  const { qcRecordID, qcID } = context.query;
  // console.log(session);

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

  // const sendData = { qcRecordID: context.query.qcRecordID };
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/qc/viewFailDetailSpecific?qcRecordID=" + qcRecordID + "&qcID=" + qcID,
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

  const data = { session: session, url: context.query, APIdata: APIdata };

  return {
    props: { data }, // will be passed to the page component as props
  };
}

// const columns = [
//   //   { name: "หมายเลขบัญชี", uid: "userID_usersProducer" },
//   // { name: "", uid: "picture" },
//   { name: "testName", uid: "testName" },
//   { name: "result", uid: "result" },
//   { name: "status", uid: "status" },

//   // { name: "detail", uid: "detail" },
// ];

const ConstructDetail = ({ data }) => {
  const router = useRouter();
  console.log(data.APIdata);
  //   const { constructID } = router.query;

  const [dataList, setDataList] = useState(data.APIdata.data);

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

        <div>
          <h1 className=" font-bold text-xl"> ข้อมูลการทดสอบ  </h1>
          <h2 className=" font-normal text-gray-500 text-base">
            qcRecordID ที่ {data.url.qcRecordID} และ qcID ที่ {data.url.qcID}
          </h2>
        </div>
      </div>

      {data.APIdata && data.APIdata.data.map((item, index) => (
        <div className="p-3">
          <p className=" font-bold ">รายละเอียด</p>
          <p>
            {item.detail}
          </p>
        </div>

      ))}

      {
        data.APIdata && data.APIdata.data.length <= 0 ? (<>
          <div className=" w-[100%] h-[20vh] flex justify-center border rounded ">
            <p className="self-center text-sm text-gray-400">ไม่พบข้อมูล</p>
          </div>
        </>
        ) : (
          <></>
        )}





    </Layout>
  );
};

export default ConstructDetail;
