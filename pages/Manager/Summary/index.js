import React from "react";

import { getSession } from "next-auth/react";
import axios from "axios";
import Layout from "../../../components/Layout";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { format } from "date-fns";
import { StyledBadge } from "../../../components/style/StyledBadge";

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session == undefined) {
    return {
      redirect: {
        permanent: false,
        destination: "/api/auth/signin",
      },
    };
  }

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const res = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "/summary/construct/overAll"
  );

  if (!res) {
    res["data"] = { data: [] };
  }

  const lastUpdateConstruct_res = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "/summary/construct/LastUpdate"
  );

  if (!lastUpdateConstruct_res) {
    res["data"] = { data: [] };
  }

  //TODO: QC
  const qcOverAll_res = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "/summary/qc/overAll"
  );

  if (!qcOverAll_res) {
    res["data"] = { data: [] };
  }

  const qc_lastUpdate_res = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "/summary/qc/LastUpdate"
  );

  if (!qcOverAll_res) {
    res["data"] = { data: [] };
  }

  //TODO: Worker statistic
  const qc_workerTopPass_res = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "/summary/qc/producedBy/rank/up"
  );

  if (!qc_workerTopPass_res) {
    res["data"] = { data: [] };
  }

  const qc_workerTopFailed_res = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "/summary/qc/producedBy/rank/low"
  );

  if (!qc_workerTopFailed_res) {
    res["data"] = { data: [] };
  }

  //TODO: Construct power

  const constructPower_res = await axios.get(
    process.env.NEXT_PUBLIC_API_URL + "/summary/canBuildFromMaterial/average"
  );

  if (!constructPower_res) {
    res["data"] = { data: [] };
  }

  const data = {
    session: session,
    url: context.query,
    overallAmount: res.data.data,
    lastUpdateConstruct: lastUpdateConstruct_res.data.data,

    overall_QC_Amount: qcOverAll_res.data.data,
    lastUpdate_QC: qc_lastUpdate_res.data.data,

    workerTopPass: qc_workerTopPass_res.data.data,
    workerTopFailed: qc_workerTopFailed_res.data.data,

    constructPower: constructPower_res.data.data,
  };

  return {
    props: { data }, // will be passed to the page component as props
  };
}

const Summary = ({ data }) => {
  console.log(data);

  ChartJS.register(ArcElement, Tooltip, Legend);

  const _data_overAllWork = {
    labels: data.overallAmount.map((el) => el.status), // ["Done", "Process"],
    datasets: [
      {
        label: "# of works",
        data: data.overallAmount.map((el) => el.amount), //[12, 5],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgb(197, 197, 197, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgb(197, 197, 197, 1)"],
        borderWidth: 1,
      },
    ],
  };
  const option = {};

  const textCenter_overWork = {
    id: "textCenter",
    beforeDatasetsDraw(charts, args, pluginOptions) {
      const { ctx, data } = charts;
      ctx.save();

      ctx.font = "bolder 35px sans-serif";
      ctx.fillStyle = "rgba(75, 192, 192, 1)";
      ctx.textAlign = "center";
      ctx.Baseline = "middle";
      if (data.datasets[0].data[1] && data.datasets[0].data[0]) {
        ctx.fillText(
          `${Math.round(
            (data.datasets[0].data[0] /
              (data.datasets[0].data[0] + data.datasets[0].data[1])) *
              100
          )} %`,
          charts.getDatasetMeta(0).data[0].x,
          charts.getDatasetMeta(0).data[0].y
        );
      }
    },
  };

  const _data_overAll_QC = {
    labels: data.overall_QC_Amount.map((el) => el.statusOverView), // ["Done", "Process"],
    datasets: [
      {
        label: "# of qc",
        data: data.overall_QC_Amount.map((el) => el.amount), //[12, 5],
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const textCenter_overAllQC = {
    id: "textCenter",
    beforeDatasetsDraw(charts, args, pluginOptions) {
      const { ctx, data } = charts;
      ctx.save();
      ctx.font = "bolder 35px sans-serif";
      ctx.fillStyle = "rgba(75, 192, 192, 1)";
      ctx.textAlign = "center";
      ctx.Baseline = "middle";
      if (data.datasets[0].data[0] && data.datasets[0].data[1]) {
        ctx.fillText(
          `${Math.round(
            (data.datasets[0].data[0] /
              (data.datasets[0].data[0] + data.datasets[0].data[1])) *
              100
          )} %`,
          charts.getDatasetMeta(0).data[0].x,
          charts.getDatasetMeta(0).data[0].y
        );
      } else {
        // ctx.fillText(
        //   `${100} %`,
        //   charts.getDatasetMeta(0).data[0].x,
        //   charts.getDatasetMeta(0).data[0].y
        // );
      }
    },
  };

  return (
    <Layout session={data.session}>
      <h1 className="font-bold text-xl mb-3 min-w-full">ข้อมูลสรุป</h1>

      {/* <div className=" border border-rose-900 w-full"></div> */}

      {/* chart  */}
      <p className=" text-gray-400 ">สถานะงาน</p>
      <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-3 justify-between">
        {/* chart - percent of work done   */}
        <div className=" self-center max-w-[250px]">
          <Doughnut
            data={_data_overAllWork}
            option={option}
            plugins={[textCenter_overWork]}
          />
        </div>

        {/* table to show last update in current day */}
        <div className=" ">
          {/* <Doughnut data={_data} /> */}
          {data.lastUpdateConstruct.length &&
          data.lastUpdateConstruct.length > 0 ? (
            <>
              <p className=" mb-2">{format(new Date(), "dd/MM/yyyy")}</p>
              <table class="min-w-full">
                <thead style={{ backgroundColor: "#f1f3f5" }}>
                  <tr>
                    <th
                      scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      Time
                    </th>
                    <th
                      scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      constructID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.lastUpdateConstruct.map((item, index) => {
                    if (item.projectName == "ไม่พบข้อมูล") return <></>;
                    return (
                      <tr key={"dataRow" + index} class="border-b">
                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {new Date(item.dateTimeUpdate).toLocaleTimeString(
                            "th-TH"
                          )}
                        </td>
                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {item.constructID}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <div className=" w-[100%] h-[20vh] flex justify-center border rounded mt-3 mb-3">
                <div className=" self-center text-center ">
                  <p className="text-sm text-gray-400">ไม่มีมีการผลิตล่าสุด</p>
                  <p className="text-sm text-gray-400">ในวันนี้</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* chart - percent of eval pass/fail over all */}
      <p className=" text-gray-400 mt-3">คุณภาพสินค้า</p>

      <div className="flex justify-end">
        <div className=" max-w-[250px]">
          <Doughnut data={_data_overAll_QC} plugins={[textCenter_overAllQC]} />
        </div>
      </div>

      {/* table - recent 10 qc check  */}

      <div className=" mt-2">
        {data.lastUpdateConstruct.length &&
        data.lastUpdateConstruct.length > 0 ? (
          <>
            <table class="min-w-full">
              <thead style={{ backgroundColor: "#f1f3f5" }}>
                <tr>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    qcRecordID
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    constructID
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    producedBy
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    statusOverView
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.lastUpdate_QC.map((item, index) => {
                  if (item.projectName == "ไม่พบข้อมูล") return <></>;
                  return (
                    <tr key={"dataRow" + index} class="border-b">
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.qcRecordID}
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.constructID}
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.producedBy_NAME}
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        <StyledBadge type={item.statusOverView}>
                          {item.statusOverView}
                        </StyledBadge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <div className=" w-[100%] h-[20vh] flex justify-center border rounded mt-3 mb-3">
              <div className=" self-center text-center ">
                <p className="text-sm text-gray-400">ไม่มีมีการตรวจสอบ</p>
                {/* <p className="text-sm text-gray-400">ในวันนี้</p> */}
              </div>
            </div>
          </>
        )}
      </div>

      <p className=" text-gray-400 mt-3 mb-2">อันดับพนักงาน</p>
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* block - top 5 worker do less fail */}
        <div>
          {data.workerTopPass.length && data.workerTopPass.length > 0 ? (
            <>
              <p className=" text-gray-400 mt-3 mb-2">ผิดพลาดต่ำ</p>
              <table class="min-w-full">
                <thead style={{ backgroundColor: "#f1f3f5" }}>
                  <tr>
                    <th
                      scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      rank
                    </th>
                    <th
                      scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      name
                    </th>
                    <th
                      scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      pass qc
                    </th>
                    <th
                      scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      all work
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.workerTopPass.map((item, index) => {
                    if (item.projectName == "ไม่พบข้อมูล") return <></>;
                    return (
                      <tr key={"dataRow" + index} class="border-b">
                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {item.nameSur}
                        </td>
                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {item.pass_qc}
                        </td>
                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {item.allWork}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <div className=" w-[100%] h-[20vh] flex justify-center border rounded mt-3 mb-3">
                <div className=" self-center text-center ">
                  <p className="text-sm text-gray-400">
                    ไม่มีมีข้อมูล ผู้ผิดพลาดต่ำ
                  </p>
                  {/* <p className="text-sm text-gray-400">ในวันนี้</p> */}
                </div>
              </div>
            </>
          )}
        </div>

        {/* block - top 5 worker do most fail */}
        <div>
          {data.workerTopFailed.length && data.workerTopFailed.length > 0 ? (
            <>
              <p className=" text-gray-400 mt-3 mb-2">ผิดพลาดมาก</p>
              <table class="min-w-full">
                <thead style={{ backgroundColor: "#f1f3f5" }}>
                  <tr>
                    <th
                      scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      rank
                    </th>
                    <th
                      scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      name
                    </th>
                    <th
                      scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      pass qc
                    </th>
                    <th
                      scope="col"
                      class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                      all work
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.workerTopFailed.map((item, index) => {
                    if (item.projectName == "ไม่พบข้อมูล") return <></>;
                    return (
                      <tr key={"dataRow" + index} class="border-b">
                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {item.nameSur}
                        </td>
                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {item.pass_qc}
                        </td>
                        <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                          {item.allWork}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <div className=" w-[100%] h-[20vh] flex justify-center border rounded mt-3 mb-3">
                <div className=" self-center text-center ">
                  <p className="text-sm text-gray-400">
                    ไม่มีมีข้อมูล ผู้ผิดพลาดสูง
                  </p>
                  {/* <p className="text-sm text-gray-400">ในวันนี้</p> */}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <p className=" text-gray-400 mt-3 mb-2">กำลังการผลิต</p>
      <div>
        {data.constructPower.length && data.constructPower.length > 0 ? (
          <>
            <table class="min-w-full">
              <thead style={{ backgroundColor: "#f1f3f5" }}>
                <tr>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    itemID
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    name
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    current
                  </th>
                  <th
                    scope="col"
                    class="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                  >
                    product(AVG)
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.constructPower.map((item, index) => {
                  if (item.projectName == "ไม่พบข้อมูล") return <></>;
                  return (
                    <tr key={"dataRow" + index} class="border-b">
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.itemID}
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.itemName}
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.currentAmount}
                      </td>
                      <td class="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                        {item.averageCanProductFromAllFormula}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <div className=" w-[100%] h-[20vh] flex justify-center border rounded mt-3 mb-3">
              <div className=" self-center text-center ">
                <p className="text-sm text-gray-400">ไม่มีมีกำลังการผลิต</p>
                <p className="text-sm text-gray-400">ในปัจจุบัน</p>
              </div>
            </div>
          </>
        )}
      </div>
      {/* table to show amount can produce from current material + amount current item */}
    </Layout>
  );
};

export default Summary;
