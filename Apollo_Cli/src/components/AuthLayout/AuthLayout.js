import React from 'react';

const AuthLayout = (props) => {
  const { children } = props
  return (
    <React.Fragment>
      <div className="login__top-header"></div>
      <div className="grid login-grid main login-box">
        {children}
      </div>
    </React.Fragment>
  )
}
export default AuthLayout