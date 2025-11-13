/* eslint-disable react-hooks/exhaustive-deps */

import { Outlet, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "@/context/auth-context";

export default function AuthLayout() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}
