import { useContext } from "react";
import { UserInfoContext } from "features/context/userInfoContext";

const useUserInfo = () => {
  return useContext(UserInfoContext);
}

export default useUserInfo
