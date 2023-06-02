import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import { Timeline, Text } from '@mantine/core';
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession, getSession } from "next-auth/react";

import { Chevron } from "../../components/icons";

import { Disclosure } from '@headlessui/react'
import { ChevronRightIcon, ChevronUpIcon } from "@heroicons/react/20/solid";


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

  const sendData = { constructID: context.query.constructID };
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/qc/construct", {
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


  const res_conDetail = await axios.get(process.env.NEXT_PUBLIC_API_URL + "/construct/detail",
    { params: { constructID: context.query.constructID } })

  // const APIdata_conDetail = await resCon.json();


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
    APIdata_conDetail: res_conDetail.data.data
  };

  return {
    props: { data }, // will be passed to the page component as props
  };
}

const ConstructDetail = ({ data }) => {
  console.log(data)
  const router = useRouter();
  console.log(data.APIdata);
  //   const { constructID } = router.query;

  return (
    <Layout session={data.session}>
      <div className="flex gap-3 align-middle mb-3">
        <button
          className=""
          onClick={() => {
            router.push("/Construct");
          }}
        >
          <Chevron direction="left"></Chevron>
        </button>

        <h1 className=" font-bold text-xl">รายละเอียด</h1>
      </div>


      {data.APIdata_conDetail && (
        <>
          <h1 className=" font-bold text-gray-400 text-x mt-3 mb-3">ทั่วไป</h1>
          <div className=" grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="email"
              >
                LotID
              </label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="customer_email"
                type="email"
                placeholder=""
                value={data.APIdata_conDetail.LotID ? data.APIdata_conDetail.LotID : ""}
                disabled
              />
            </div>

            <div>
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="email"
              >
                lotName
              </label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="customer_email"
                type="email"
                placeholder=""
                value={data.APIdata_conDetail.lotName ? data.APIdata_conDetail.lotName : ""}
                // onChange={(event) =>
                //   setEmail(event.target.value)
                // }
                disabled
              />
            </div>

            <div>
            </div>

            <div>
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="email"
              >
                constructID
              </label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="customer_email"
                type="email"
                placeholder=""
                value={data.APIdata_conDetail.constructID ? data.APIdata_conDetail.constructID : ""}
                // onChange={(event) =>
                //   setEmail(event.target.value)
                // }
                disabled
              />
            </div>

            <div>
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="email"
              >
                name
              </label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="customer_email"
                type="email"
                placeholder=""
                value={data.APIdata_conDetail.name ? data.APIdata_conDetail.name : ""}
                // onChange={(event) =>
                //   setEmail(event.target.value)
                // }
                disabled
              />
            </div>


            <div>
              <label
                class="block text-gray-700 text-sm font-bold mb-2"
                for="email"
              >
                itemType
              </label>
              <input
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="customer_email"
                type="email"
                placeholder=""
                value={data.APIdata_conDetail.itemType ? data.APIdata_conDetail.itemType : ""}
                // onChange={(event) =>
                //   setEmail(event.target.value)
                // }
                disabled
              />
            </div>

          </div>

          <h1 className=" font-bold text-gray-400 text-x mt-3 mb-3">รายละเอียด</h1>
          <div>
            <textarea id="message"
              rows="4"
              className="block p-2.5 w-full text-sm bg-gray-50 rounded-lg border border-gray-300 "
              value={data.APIdata_conDetail.detail ? data.APIdata_conDetail.detail : ""}
              disabled>

            </textarea>
          </div>


          <div className=" m-3">

            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-100 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75">
                    <span> สูตรการผลิต: {data.APIdata_conDetail.formulaDetail.name} </span>
                    <ChevronUpIcon
                      className={`${open ? "rotate-180 transform" : ""
                        } h-5 w-5 text-gray-500`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                    <Timeline active={data.APIdata_conDetail.formulaDetail.materials.length ? data.APIdata_conDetail.formulaDetail.materials.length : 0} bulletSize={24} lineWidth={2}>
                      {
                        data.APIdata_conDetail.formulaDetail.materials.map((material) => (
                          <Timeline.Item title={material.itemName ? material.itemName : ""}>
                            <Text size="xs" mt={4}>amount: {material.amount ? material.amount : ""}</Text>
                          </Timeline.Item>

                        ))

                      }


                    </Timeline>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>



          </div>


        </>

      )}





      <h1 className=" font-bold text-x mt-3 mb-3">ประวัติการทดสอบ</h1>
      <div className="flex flex-row flex-wrap gap-6">
        {data.APIdata &&
          data.APIdata.data.map((item, index) => (
            <>
              <div
                className="min-w-[260px] min-h-[140px] shadow border bg-neutral-50 p-2 rounded ring-offset-2 hover:ring-2 hover:ring-sky-700 transition duration-300"
                key={"item_" + item.qcRecordID}
                onClick={() => {
                  router.push({
                    pathname: "/Construct/QcResult/" + item.qcRecordID,
                    // query: { constructID: item.constructID },
                  });
                }}
              >
                <div className="flex flex-col gap-1">
                  <h1
                    className={
                      (item.statusOverView == "Passed"
                        ? "text-green-500"
                        : "text-red-500") + " font-semibold text-center"
                    }
                  >
                    {item.statusOverView}
                  </h1>
                  <p>{String(item.dateTime).split("T")[0]}</p>
                  <p>{item.NAMEqcProject}</p>
                  <p>producedBy: {item.NAMEproducedBy}</p>
                  <p>testBy: {item.NAMEtestBy}</p>
                </div>
              </div>
            </>
          ))}

        {data.APIdata && data.APIdata.data.length <= 0 ? (
          <>
            <div className=" w-[100%] h-[20vh] flex justify-center border rounded ">
              <p className="self-center text-sm text-gray-400">ไม่พบประวัติการตรวจสอบ</p>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </Layout>
  );
};

export default ConstructDetail;
