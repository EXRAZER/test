import React, { useState, useEffect } from "react";

import { getSession } from "next-auth/react";
import ConstructTable from "../../../components/pages/manager/ConstructTable";
import { StyledBadge } from "../../../components/style/StyledBadge";

import {
  Button,
  Checkbox,
  Input,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import Layout from "../../../components/Layout";

import { useRouter } from "next/router";
import { Menu, Transition } from "@headlessui/react";
import Swal from "sweetalert2";

export async function getServerSideProps(context) {
  const session = await getSession(context);
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
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/items/list", {
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

  const data = { session: session, APIdata: APIdata };

  return {
    props: { data }, // will be passed to the page component as props
  };
}

const Add = ({ data }) => {
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

    // SEND DATA TO API
    const sendData = {
      itemID: event.target.itemID.value,
      costPerItem: event.target.costPerItem.value,
      buyBy: data.session.id,
      amount: event.target.amount.value,
    };

    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/items/wantBuy", {
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
        text: "Add request order success.",
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "Oops...",
        text: APIdata.message,
      });
    }
    // clear old data in form
    event.target.itemID.value = ""; 
    event.target.costPerItem.value = ""; 
    event.target.amount.value = ""; 

  };

  return (
    <Layout session={data.session}>
      <Title order={2} style={{ marginBottom: "20px" }}>
        เพิ่มใบสั่งซื้อ
      </Title>
      <>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                for="itemID"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                สิ่งของ
              </label>

              <select
                name="itemID"
                id="itemID"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              >
                <option selected></option>
                {data.APIdata.data.map((item, index) => (
                  <option value={item.itemID}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                for="costPerItem"
                class="block mb-2 text-sm font-medium text-gray-900"
              >
                ราคาต่อ หน่วย
              </label>
              <input
                min={0}
                type="number"
                id="costPerItem"
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 0"
                placeholder=""
                required
              />
            </div>

            <div>
              <label
                for="amount"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                จำนวน
              </label>
              <input
                min={0}
                type="number"
                id="amount"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder=""
                required
              />
            </div>
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
