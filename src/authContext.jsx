import React, { useReducer } from "react";
import { useNavigate } from "react-router";
import MkdSDK from "./utils/MkdSDK";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  role: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      //TODO
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user_id,
        token: action.payload.token,
        role: action.payload.role,
      };
    case "LOGOUT":
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

let sdk = new MkdSDK();

export const tokenExpireError = (dispatch, errorMessage) => {
  const role = localStorage.getItem("role");
  if (errorMessage === "TOKEN_EXPIRED") {
    dispatch({
      type: "Logout",
    });
    window.location.href = "/" + role + "/login";
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const navigate = useNavigate();
  React.useEffect(() => {
    //TODO
    const checkstatus = async () => {
      const response = await sdk.check("admin");
      if (response) {
        dispatch({ type: "LOGOUT" });
        // navigate("/admin/login");
      }
      // console.log("status>>", response);
    };
    console.log(state.isAuthenticated);
    if (state.isAuthenticated) {
      console.log("Inside effect");
      setTimeout(() => {
        checkstatus();
      }, parseInt(localStorage.getItem("expires_at")) + 1);
    }
  }, [state.isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
