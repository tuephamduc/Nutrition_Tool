import { useEffect, useState } from "react";
import Cookies from 'js-cookie';

const userCookie = Cookies.getJSON("userCookie");
const initialState = userCookie ? userCookie : null;

const useAuthProvider = () => {
  const [user, setUser] = useState(initialState);
  const logout = () => {
    setUser(null);
    Cookies.remove("userCookie")
  }

  const handleLoginSuccess = (res) => {
    setUser({
      token: res.token,
      roles: res.user.roles
    })
    _setUserCookie(res.token, res.user.roles)
  }

  const _setUserCookie = (token, roles) => {
    Cookies.set(
      "userCookie",
      {
        token: token,
        roles: roles
      }
    )
  }

  const getRoute = (roles) => {
    const route = {
      ADMIN: "/admin/",
      USER: "/user/",
    };

    return route[roles];
  };
  useEffect(() => {
  }, [user]);
  return {
    user,
    handleLoginSuccess,
    getRoute,
    logout
  }
}

export default useAuthProvider;