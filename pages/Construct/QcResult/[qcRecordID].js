import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import {
  Badge,
  Button,
  Dialog,
  Group,
  Input,
  MultiSelect,
  NumberInput,
  Select,
  Stepper,
  Table,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession, getSession } from "next-auth/react";

import { StyledBadge } from "../../../components/style/StyledBadge";
import { Chevron } from "../../../components/icons"


export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log(context.query);
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

  const sendData = { qcRecordID: context.query.qcRecordID };
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/qc/viewDetailTestResult",
    {
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

const columns = [
  //   { name: "หมายเลขบัญชี", uid: "userID_usersProducer" },
  // { name: "", uid: "picture" },
  { name: "testName", uid: "testName" },
  { name: "result", uid: "result" },
  { name: "status", uid: "status" },

  // { name: "detail", uid: "detail" },
];

const ConstructDetail = ({ data }) => {
  const router = useRouter();
  console.log(data.APIdata);
  //   const { constructID } = router.query;

  const [dataList, setDataList] = useState(data.APIdata.data);

  return (
    <Layout session={data.session}>
      {/* <button
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        style={{ backgroundColor: "#AACB73", marginRight: "20px" }}
        onClick={() => {
          router.back();
        }}
      >
        {"<Back"}
      </button>

      <Title order={4} style={{ marginBottom: "15px" }}>
        ผลการทดสอบย่อย {data.url.qcRecordID}
      </Title> */}

      <div className="flex gap-3 align-middle mb-3">
        <button
          className=""
          onClick={() => {
            router.back();
          }}
        >
          <Chevron direction="left"></Chevron>
        </button>

        <h1 className=" font-bold text-xl"> ผลการทดสอบย่อย {data.url.qcRecordID} </h1>
      </div>



      <table className="min-w-full">
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
          {dataList.map((item, index) => {
            if (item.projectName == "ไม่พบข้อมูล") return <></>;
            return (
              <tr key={"dataRow" + index} className="border-b hover:bg-gray-50 transition duration-200" onClick={() => {
                console.log(item.qcID);
                router.push("/Construct/QcResult/Fail?qcRecordID="+item.qcRecordID+"&qcID="+item.qcID);
              }}>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {item.testName}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {item.result}
                </td>
                <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  <StyledBadge type={item.status}>{item.status}</StyledBadge>
                </td>

                {/* <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                  {item.detail}
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Layout>
  );
};

export default ConstructDetail;
