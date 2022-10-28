import React from "react";
import { GlobalContext } from "../globalContext";

const AdminDashboardPage = () => {
  const { state, dispatch } = React.useContext(GlobalContext);

  return (
    <>
      <div className="w-full flex justify-center items-center text-7xl h-screen text-gray-700 ">
        Dashboard
      </div>
    </>
  );
};

export default AdminDashboardPage;
