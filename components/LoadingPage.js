import React from "react";
import Image from "next/image";

export default function LoadingPage() {
  return (
    <div className="flex min-h-screen justify-center items-center">
      <Image src="/loading.gif" alt="my gif" height={100} width={100} />
      <p>loadingPage</p>
    </div>
  );
}
