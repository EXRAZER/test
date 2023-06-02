import React, { useState, useEffect } from "react";

import { getSession } from "next-auth/react";
import Layout from "../../components/Layout";
import ConstructTable from "../../components/pages/manager/ConstructTable";
import { StyledBadge } from "../../components/style/StyledBadge";

import {
  Button,
  Checkbox,
  Input,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import { useRouter } from "next/router";

import Swal from "sweetalert2";
import axios from "axios";

import { Chevron } from "../../components/icons";
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

  if (!(session.role == "manager" || session.role == "storage")) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  const data = { session: session };

  return {
    props: { data }, // will be passed to the page component as props
  };
}

const Add = ({ data }) => {
  const router = useRouter();
  const [checkedFavorites, setCheckedFavorites] = useState(false);
  const [insurancePeriod, setInsurancePeriod] = useState(12);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    // alert(`The name you entered was: ${event.target.username.value}`);
    // send data to api
    const sendData = {
      warehouseID: 1,
      isFavorite: checkedFavorites,
      amount: 0, //event.target.amount.value,
      costPrice: event.target.costPrice.value,
      name: event.target.name.value,
      detail: event.target.detail.value,

      salePrice: event.target.salePrice.value,
      insurancePeriod: insurancePeriod,
    };
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/items", {
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
      Toast.fire({
        icon: "success",
        title: "success",
        text: "add item success.",
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Oops...",
        text: APIdata.message,
      });
    }
    // clear old data in form
    //event.target.amount.value = "";
    event.target.costPrice.value = "";
    event.target.name.value = "";
    event.target.detail.value = "";
    setCheckedFavorites(false);
  };

  return (
    <Layout session={data.session}>
      {/* <button
        data-mdb-ripple="true"
        data-mdb-ripple-color="light"
        className="mb-3 inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        style={{ backgroundColor: "#82AAE3", marginLeft: "auto" }}
        onClick={() => {
          router.back();
        }}
      >
        Back
      </button> */}
      {/* <Title order={2} style={{ marginBottom: "20px" }}>
        เพิ่มหมวดสิ่งของ
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

        <h1 className=" font-bold text-xl">เพิ่มหมวดสิ่งของ</h1>
      </div>

      <>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                for="name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                สิ่งของ
              </label>
              <input
                type="text"
                id="name"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 0"
                placeholder=""
                required
              />
              <Checkbox
                className="mt-3"
                label="รายการโปรด"
                color="primaryColor"
                checked={checkedFavorites}
                onChange={(event) =>
                  setCheckedFavorites(event.currentTarget.checked)
                }
              />
              {/* <select
                name="itemName"
                id="itemName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                <option selected></option>
                {[].map((item, index) => (
                  <option value={item.itemID}>{item.name}</option>
                ))}
              </select> */}
            </div>
          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                for="costPrice"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                ราคาต้นทุนต่อ หน่วย
              </label>
              <input
                min={0}
                type="number"
                id="costPrice"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 0"
                placeholder=""
                required
              />
            </div>

            <div>
              <label
                for="salePrice"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                ราคาขายต่อ หน่วย
              </label>
              <input
                min={0}
                type="number"
                id="salePrice"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 0"
                placeholder=""
                required
              />
            </div>

            <div>
              <label
                for="insurancePeriod"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                ระยะเวลาประกัน (เดือน)
              </label>
              <input
                min={0}
                type="number"
                id="insurancePeriod"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 0"
                placeholder=""
                value={insurancePeriod}
                onChange={(event) => {
                  setInsurancePeriod(event.target.value);
                }}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              for="detail"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              รายละเอียด
            </label>
            <textarea
              id="detail"
              rows="4"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 "
              placeholder=""
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              บันทึก
            </button>
          </div>
        </form>
      </>
    </Layout>
  );
};

export default Add;
