import React from "react";
import SideNavbar from "./SideNavbar";
import Footer from "./Footer";
import MyNavbar from "./MyNavbar";

import LoadingPage from "./LoadingPage";
import { Suspense } from "react";

const Layout = ({ children, session }) => {


  return (
    <div className="flex flex-col border flex-grow">
      <div className="min-h-screen flex flex-row ">
        <Suspense fallback={<LoadingPage />}>
          <SideNavbar session={session} />
          <div className="bg-primary flex-1 ml-0 md:ml-[240px]">
            <MyNavbar session={session} />

            <div className="mt-4 ml-3 mr-3 mb-3 p-3">
              {children}
            </div>
          </div>

        </Suspense>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
