import React, { useState } from "react";

import Swal from "sweetalert2";
import { getSession } from "next-auth/react";
import Layout from "../../components/Layout";
import UserActionTable from "../../components/pages/manager/UserActionTable";

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
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/user/userAction",
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

  const data = { session: session, APIdata: APIdata };

  return {
    props: { data }, // will be passed to the page component as props
  };
}

const columns = [
  //   { name: "หมายเลขบัญชี", uid: "userID_usersProducer" },
  // { name: "", uid: "picture" },
  { name: "เวลา", uid: "createDate" },
  { name: "ip", uid: "ip" },
  { name: "ชื่อผู้ใช้", uid: "username" },
  { name: "การกระทำ", uid: "detail" },
];


const UserAction = ({ data }) => {

  console.log(data.APIdata.data);

  const [userAction, setUserAction] = useState(data.APIdata.data);
  return (
    <Layout session={data.session}>
      <div className="flex flex-col gap-3 ">
        <h1 className="text-xl"> รายงานการกระทำ </h1>
        {/* <div>UserAction</div> */}
        <UserActionTable
          setIsLoad={() => { }}
          session={data.session}
          columns={columns}
          role="Worker"
          dataList={userAction}
          setUpdateTable={() => { }}
          deletePath="/worker"
        />


        {/* {data.APIdata.data} */}
      </div>
    </Layout>
  );
};

export default UserAction;
