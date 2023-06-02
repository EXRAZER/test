import React, { useEffect, useState } from "react";

import Layout from "../components/Layout";
import LoadingPage from "../components/LoadingPage";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

import Barcode from "react-barcode";

import { Printer } from "../components/icons";

const UserDetail = () => {
  const { data: session, status, loading } = useSession();
  // const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(true);

  // query from url
  const router = useRouter();
  const { role, id } = router.query;

  const _userDetail = [
    // ข้อมูลทั่วไป
    {
      isDivider: true,
      id: "divider_1",
      sectionShow: "ข้อมูลทั่วไป",
      value: "",
    },
    {
      isDivider: false,
      id: "userID_usersProducer",
      sectionShow: "หมายเลขบัญชี",
      value: "",
    },
    // { isDivider: false, id: "prefix", sectionShow: "คำนำหน้า", value: "-" },
    {
      isDivider: false,
      id: "username",
      sectionShow: "ชื่อผู้ใช้งาน",
      value: "-",
    },
    { isDivider: false, id: "role", sectionShow: "ตำแหน่ง", value: "-" },
    { isDivider: false, id: "gender", sectionShow: "เพศ", value: "-" },

    // ข้อมูลการติดต่อ
    {
      isDivider: true,
      id: "divider_2",
      sectionShow: "ข้อมูลการติดต่อ",
      value: "",
    },
    { isDivider: false, id: "email", sectionShow: "อีเมล", value: "" },
    { isDivider: false, id: "number", sectionShow: "โทร", value: "" },
  ];

  const [userDetail, setUserDetail] = useState(_userDetail);
  const [barcodeVal, setBarcodeVal] = useState("");

  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
  }

  async function getUserDetail(_id) {
    const sendData = { userID_usersProducer: _id };
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user/profile", {
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
      console.log("APIdata.data");
      console.log(APIdata);
      setBarcodeVal(APIdata.data.userID_usersProducer);
      // console.log(APIdata.data);

      let temp = userDetail;
      for (let i in userDetail) {
        // console.log(userDetail[i])
        if (userDetail[i].isDivider == false) {
          if (temp[i].id.includes("date") || temp[i].id.includes("day")) {
            const today = new Date();
            const dateData = new Date(APIdata.data[temp[i].id]);
            const today_yyyy = today.getFullYear();
            const yyyy = dateData.getFullYear();
            let mm = dateData.getMonth();
            let dd = dateData.getDate();
            if (temp[i].id == "Birthday") {
              for (var _i in temp) {
                if (temp[_i].id == "age") {
                  temp[_i].value = today_yyyy - yyyy;
                  break;
                }
              }
            }
            temp[i].value = `${dd}/${mm}/${yyyy}`;
            continue;
          }
          if (
            APIdata.data[temp[i].id] == null ||
            APIdata.data[temp[i].id] == undefined
          ) {
            continue;
          }
          temp[i].value = APIdata.data[temp[i].id];
        }
      }

      setIsLoadingDetail(false);
      setUserDetail(temp);
    } else {
      router.push("/Error");
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      console.log(session.role);
      if (session.role == "manager" || session.role == "admin") {
        if (id) getUserDetail(id);
        else getUserDetail(session.id);
      } else {
        getUserDetail(session.id);
      }
    }
  }, [status, userDetail]);

  // const columns = [
  //     { name: "ชื่อสถานที่", uid: "namePlace" },
  //     { name: "แผนก/หน่วยงาน", uid: "department" },
  //     { name: "ระยะเวลา", uid: "range" },
  //     { name: "ประสบการณ์ทำงาน(ปี)", uid: "expTimeYear" },
  //     { name: "ที่อยู่ที่ทำงาน", uid: "workAddress" },
  // ];

  return (
    <>
      {status === "loading" ||
      status === "unauthenticated" ||
      isLoadingDetail == true ? (
        <LoadingPage />
      ) : (
        <Layout session={session}>
          {/* <div className="block h-full min-h-screen justify-center space-y-4 p-4"> */}
          <div className="flex">
            <h1 className="text-xl font-bold mb-3">รายละเอียดผู้ใช้</h1>
            <div
              className="ml-auto"
              onClick={() => {
                window.print();
              }}
            >
              <Printer isOutline={true}/>

            </div>
          </div>

          <div className="border drop-shadow bg-gray-100 rounded-lg p-5 flex flex-row flex-wrap gap-3">
            {userDetail.map((data, index) => {
              if (data.isDivider == true) {
                return (
                  <div key={data.id} className="min-w-full mt-2">
                    <h2 className="text-lg font-bold">{data.sectionShow}</h2>
                    <p>{data.value}</p>
                  </div>
                );
              } else {
                return (
                  <div
                    key={data.id}
                    className=" flex flex-wrap flex-row min-w-fit flex-grow"
                  >
                    <p>{data.sectionShow}: &nbsp;</p>
                    <p>{data.value}</p>
                  </div>
                );
              }
            })}
          </div>
          {/* <button
            data-mdb-ripple="true"
            data-mdb-ripple-color="light"
            className="mt-3 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
            style={{ backgroundColor: "#82AAE3", marginLeft: "auto" }}
            onClick={() => {
              window.print();
            }}
          >
            Print
          </button> */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              padding: "40px",
              gap: "20px",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "block",
                width: "700px",
                height: "150px",
                transform: "rotate(90deg) scale(0.5)",
                position: "absolute",
                top: "130px",
                right: "-317px",
              }}
            >
              <Barcode value={barcodeVal} />
            </div>
          </div>
        </Layout>
      )}
    </>
  );
};

export default UserDetail;
