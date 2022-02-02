import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import useAuth from "hooks/Auth/useAuth";
import { GET_USER_INFO } from "graphql/User/UserQuery";
import { message } from "antd";
import { EDIT_AVATAR, EDIT_USER_INFO } from "graphql/Basic/BasicMutation";


const useUserInfoProvider = () => {
  const [userInfo, setUserInfo] = useState();
  const auth = useAuth()

  const [getUserInfo, { data: info }] = useLazyQuery(GET_USER_INFO, {
    onError(error) {
      message.error(error.message)
    }
  })

  const [uploadAvatar, { data: avatar }] = useMutation(EDIT_AVATAR, {
    onCompleted({ uploadAvatar }) {
      setUserInfo(prevState => {
        return ({
          ...prevState,
          avatar: uploadAvatar.url
        })
      })
      message.success("Đổi ảnh đại diện thành công")
    },
    onError(error) {
      message.error(error.message)
    }
  })

  const [changeUserProfile, { data: profile }] = useMutation(EDIT_USER_INFO, {
    onCompleted({ changeUserProfile }) {
      setUserInfo(prevState => {
        return ({
          ...prevState,
          username: changeUserProfile.username,
          gender: changeUserProfile.gender,
          avatar: changeUserProfile.avatar,
          birthday: changeUserProfile.birthday,
          height: changeUserProfile.height,
          weight: changeUserProfile.weight,
        })
      })
      message.success("Thay đổi thành công")
    }, onError(error) {
      message.error(error.message)
    }
  })


  useEffect(() => {
    if (auth.user) {
      getUserInfo()
    }
    if (auth.user && info) {
      setUserInfo({
        username: info.currentUser.username,
        email: info.currentUser.email,
        avatar: info.currentUser?.userProfile?.avatar,
        gender: info.currentUser?.userProfile?.gender,
        birthday: info.currentUser?.userProfile?.birthday,
        height: info.currentUser?.userProfile?.height,
        weight: info.currentUser?.userProfile?.weight,
      })
    }
  }, [auth, getUserInfo, info]);


  return {
    userInfo,
    uploadAvatar,
    changeUserProfile
  }
}

export default useUserInfoProvider