import "./App.css";
import { useSelector } from "react-redux";
import { ConfigProvider } from "antd";
import lightMode from "./theme/lightModePalette";
import darkMode from "./theme/darkModePalette";
import getTheme from "./theme";
import AppLayout from "./components/Layout/AppLayout";
import ControlPanel from "./components/Oscilloscope/DisplayData/ControlPanel";
import ReadSerial from "./components/Oscilloscope/ReadData/ReadSerial";

const App = () => {
  const appTheme = useSelector((state) => state.appMode);

  return (
    <ConfigProvider
      theme={
        getTheme(
          localStorage.getItem("appTheme") == "light" ? lightMode : darkMode
        ) || getTheme(appTheme === "light" ? lightMode : darkMode)
      }
    >
      <AppLayout sideBar={<ControlPanel />} content={<ReadSerial />} />
    </ConfigProvider>
  );
};

export default App;
