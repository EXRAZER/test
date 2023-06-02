import React from 'react'

import styles from "../styles/Home.module.css";
import Image from "next/image";
// import vercel from "../public";

export default function Footer() {
  return (
    <footer className=" ml-0 md:ml-[280px] flex justify-center items-center border-t-1 border-black-100 p-[2rem]">
          <p className="text-center text-gray-500 text-xs ">
            &copy;2022 Storage Management@Naresuan University v.0.0.1.  All rights reserved.
          </p>
        </footer>
  )
}
