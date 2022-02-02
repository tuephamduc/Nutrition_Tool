import React from "react";
import MainHeader from "components/MainLayout/MainHeader";

const MainLayout = (props) => {
  const { children } = props

  return (
    <React.Fragment>
      <MainHeader>
      </MainHeader>
      {children}
    </React.Fragment>
  )
}

export default MainLayout;