import { useEffect } from "react";
import { Breadcrumb, Layout, theme, Avatar, Switch } from "antd";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
const { Header, Content, Footer } = Layout;
import actions from "../../config/actions/actions";
import Logo from "../../assets/oscillograph.png";

const AppLayout = ({ sideBar, content }) => {
  const dispatch = useDispatch();
  const appTheme = useSelector((state) => state.appMode);
  const {
    token: { colorBgContainer, breadCrumb, switchColor, colorText },
  } = theme.useToken();

  return (
    useEffect(() => {
      dispatch(actions.setAppMode(localStorage.getItem("appTheme")));
    }, [dispatch]),
    (
      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
            height: "10vh",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: colorBgContainer,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Avatar src={Logo} shape="square" size={64} />
            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                textAlign: "center",
                margin: "0 10px",
                color: colorText,
              }}
            >
              VoltWatch
            </p>
          </div>
          <Switch
            style={{
              backgroundColor: switchColor,
              justifyContent: "flex-end",
            }}
            checkedChildren="Dark"
            unCheckedChildren="Light"
            defaultChecked={
              localStorage.getItem("appTheme") == "light" ? true : false
            }
            onChange={() => {
              dispatch(
                actions.setAppMode(appTheme === "light" ? "dark" : "light")
              );
              localStorage.setItem(
                "appTheme",
                appTheme === "light" ? "dark" : "light"
              );
            }}
          />
        </Header>
        <Content
          style={{
            padding: "0 15px",
            overflow: "auto",
            background: breadCrumb,
          }}
        >
          <Breadcrumb
            style={{
              margin: "15px 0",
            }}
          ></Breadcrumb>
          <div className="container">
            <div>{sideBar}</div>
            <div>{content}</div>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            background: colorBgContainer,
          }}
        >
          VoltWatch ©2023 Created by @joelofelectronics
        </Footer>
      </Layout>
    )
  );
};
export default AppLayout;

AppLayout.propTypes = {
  content: PropTypes.any,
  sideBar: PropTypes.any,
};
