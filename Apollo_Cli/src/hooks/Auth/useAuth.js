import { useContext } from "react";
import { AuthContext } from "features/context/authContext";

const useAuth = () => {
  return useContext(AuthContext);
}

export default useAuth
