import React from 'react';
import useAuth from "hooks/Auth/useAuth"
import { Link } from 'react-router-dom';
import { Logo } from 'constants/Images/Images';
import { Menu } from 'antd';
const { SubMenu } = Menu;

const MainHeader = () => {
  const auth = useAuth();

  return (
    <header className='top-header'>
      <div className='top-container'>
        <nav className='navbar'>
          <div className="navMobile"></div>
          <div >
            <Link to="/" className='top-header__logo'>
              <img src={Logo} alt='food-logo' style={{ width: '6rem', borderRadius: "50%" }}>
              </img>

              <h2 className='top-header__logo--title'>
                My Food Data
              </h2>
            </Link>
          </div>

          <div className='menu'>
            <Menu mode="horizontal" triggerSubMenuAction='click'>
              <SubMenu key="tool" title="Công cụ">
                <Menu.Item>
                  <Link
                    // style={{ color: "#3aa9e0" }}
                    to="/tools/sort-food"
                  >
                    Sắp xếp
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link
                    // style={{ color: "#3aa9e0" }}
                    to="/tools/search"
                  >
                    Tìm kiếm
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link
                    // style={{ color: "#3aa9e0" }}
                    to="/tools/cacluate-total"
                  >
                    Tính tổng dinh dưỡng
                  </Link>
                </Menu.Item>
              </SubMenu>

              <SubMenu key="list" title="Food List">

              </SubMenu>
              <Menu.Item>
                About
              </Menu.Item>

              {auth.user ?
                <Menu.Item key="dash">
                  <Link to={auth.user.roles === "ADMIN" ? "/admin" : "/user/my-food"}
                    style={{ color: "#1890FF" }}
                  >
                    Dashboard
                  </Link>
                </Menu.Item> :
                <React.Fragment>
                  <SubMenu title="Đăng nhập" >
                    <Menu.Item key="/login" >
                      <Link to="/login">
                        Đăng nhập
                      </Link>
                    </Menu.Item>

                    <Menu.Item key="/login/admin" >
                      <Link to="/login/admin">
                        Bạn là người quản trị viên?
                      </Link>
                    </Menu.Item>
                  </SubMenu>
                  <Menu.Item key="/register"  >
                    <Link to="/register" style={{ color: "#3aa9e0" }}>
                      Đăng ký
                    </Link>
                  </Menu.Item>
                </React.Fragment>
              }

            </Menu>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default MainHeader