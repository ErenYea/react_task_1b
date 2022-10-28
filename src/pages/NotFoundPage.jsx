import React, { useEffect } from "react";
import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/admin/login", { replace: true });
  }, []);
  return (
    <div className="w-full flex justify-center items-center text-7xl h-screen text-gray-700 ">
      Not Found
    </div>
  );
};

export default NotFoundPage;
