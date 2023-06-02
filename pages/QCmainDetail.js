import React, { useEffect, useState } from "react";

import Layout from "../components/Layout";
import LoadingPage from "../components/LoadingPage";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const UserDetail = () => {
  const { data: session, status, loading } = useSession();
  // const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [workHistoryList, setWorkHistoryList] = useState([]);

  // query from url
  const router = useRouter();
  const { role, id } = router.query;

  const _userDetail = [
    // ข้อมูลทั่วไป
    { isDivider: true,id: "divider_1", sectionShow: "ข้อมูลทั่วไป",value: "",},
    { isDivider: false, id: "userID_usersProducer", sectionShow: "หมายเลขบัญชี", value: "" },
    { isDivider: false, id: "prefix", sectionShow: "คำนำหน้า", value: "-" },
    { isDivider: false,id: "username",sectionShow: "ชื่อผู้ใช้งาน", value: "-",},
    { isDivider: false, id: "role", sectionShow: "ตำแหน่ง", value: "-" },
    { isDivider: false, id: "gender", sectionShow: "เพศ", value: "" },
    { isDivider: false, id: "gender", sectionShow: "เพศ", value: "-" },
    { isDivider: false, id: "gender", sectionShow: "เพศ", value: "-" },
    { isDivider: false, id: "gender", sectionShow: "เพศ", value: "-" },
    { isDivider: false, id: "gender", sectionShow: "เพศ", value: "-" },
    { isDivider: false, id: "gender", sectionShow: "เพศ", value: "-" },
    { isDivider: false, id: "gender", sectionShow: "เพศ", value: "-" },
    { isDivider: false, id: "gender", sectionShow: "เพศ", value: "-" },

    // ข้อมูลการติดต่อ
    { isDivider: true,id: "divider_2", sectionShow: "ข้อมูลการติดต่อ",value: "",},
    { isDivider: false, id: "email", sectionShow: "อีเมล", value: "" },
    { isDivider: false, id: "number", sectionShow: "โทร", value: "" },

  ];

  const [userDetail, setUserDetail] = useState(_userDetail);

  // if (status === "unauthenticated") {
  //   router.push("/api/auth/signin");
  // }

  async function getUserDetail(_role, _id) {
    const sendData = { role: _role, id: _id };
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/user/detail", {
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
    }
  }

  useEffect(() => {
    if (status === "authenticated") {
      if(role != undefined && id != undefined)
      getUserDetail(role, id);
    }
  }, [status, userDetail, workHistoryList]);

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
          <h1 className="text-xl font-bold mb-3">รายละเอียดผู้ใช้</h1>
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
                  <>
                  <div
                    key={data.id}
                    className=" flex flex-wrap flex-row flex-grow  min-w-[200px]"
                  >
                    <p>{data.sectionShow}: &nbsp;</p>
                    <p>{data.value}</p>
                  </div>
                  </>

                );
              }
            })}
          </div>
        </Layout>
      )}
    </>
  );
};

export default UserDetail;
