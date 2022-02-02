import React, { createContext } from "react";
import useUserInfoProvider from "hooks/UserInfo/useUserInfoProvider";

export const UserInfoContext = createContext()

const UserInfoProvider = ({ children }) => {
  const userInfo = useUserInfoProvider()
  return (
    <UserInfoContext.Provider value={userInfo}>
      {children}
    </UserInfoContext.Provider>
  )
}

export default UserInfoProvider