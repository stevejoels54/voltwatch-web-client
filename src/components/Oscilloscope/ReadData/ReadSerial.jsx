import { useState, useEffect } from "react";
import { notification, theme, Button, InputNumber, Select } from "antd";
import GraphChart from "../DisplayData/GraphChart";
import { PoweroffOutlined, DownloadOutlined } from "@ant-design/icons";
import { isEmpty } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import actions from "../../../config/actions/actions";
import { CSVLink } from "react-csv";
import { ADC_OPTIONS } from "../../../constants";

const filters = [
  { usbVendorId: 0x2341, usbProductId: 0x0043 },
  { usbVendorId: 0x2341, usbProductId: 0x0001 },
];

let port;
let data;
let reader;
let portInfo;
let numericArray = [];

function ReadSerial() {
  const {
    token: { containerBg, colorText },
  } = theme.useToken();

  const headers = [
    { label: "Time", key: "time" },
    { label: "Voltage", key: "voltage" },
  ];

  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.isPlaying);
  const isRecording = useSelector((state) => state.isRecording);
  const sendData = useSelector((state) => state.sendWaveData);
  const sendStatus = useSelector((state) => state.sendStatus);
  const [connected, setConnected] = useState(false);
  const [chartValues, setChartValues] = useState();
  const [scanRate, setScanRate] = useState(100);
  const [voltageRef, setVoltageRef] = useState(5.2);
  const [frequency, setFrequency] = useState();
  const [maxVoltage, setMaxVoltage] = useState();
  const [minVoltage, setMinVoltage] = useState();
  const [avgVoltage, setAvgVoltage] = useState();
  const [adc, setAdc] = useState(10);

  // Read and send data to serial port
  const readData = async () => {
    if ("serial" in navigator) {
      notification.success({
        message: "Web Serial supported",
      });
      try {
        port = await navigator.serial.requestPort({ filters });
        portInfo = port.getInfo();
        await port.open({ baudRate: 2000000 });

        while (port.readable) {
          reader = port.readable.getReader();
          try {
            const { value, done } = await reader.read();
            if (done) {
              break;
            }
            data = value;
            // Add the received data to the buffer
          } catch (ex) {
            if (ex.name === "NotFoundError") {
              notification.error({
                message: "Device NOT found",
                description: "Please connect device and try again",
              });
            } else {
              notification.warning({
                message: "Error",
                description: ex.toString(),
              });
              notification.error({
                message: "Device NOT found",
                description: "Please disconnect device and try again",
              });
            }
          } finally {
            reader.releaseLock();
          }
        }
        await port.close();
      } catch {
        notification.error({
          message: "No Device Selected",
          description: "Please connect device and try again",
        });
      }
    } else {
      notification.error({
        message: "Web Serial not supported",
        description: "Please use Chrome or Edge",
      });
    }
  };

  const onScanRateChange = (value) => {
    setScanRate(value);
  };

  useEffect(() => {
    let intervalId;
    intervalId = setInterval(() => {
      const formattedData = new TextDecoder().decode(data);
      let splitData = formattedData?.split(",");
      for (let i = 0; i < splitData.length; i++) {
        let value = parseInt(splitData[i]);
        if (!isNaN(value)) {
          if (numericArray.length >= 100) {
            numericArray.pop(); // remove last element from array
          }
          numericArray.unshift(value); // add new value to front of array
        }
      }

      let interval = 0; // set the time interval value
      const objects = numericArray.map((value) => {
        interval = interval + scanRate / 100;
        const time = interval;
        return { time, voltage: (value * voltageRef) / Math.pow(2, adc) };
      });

      // Find maximum voltage
      const maxVoltage = objects.reduce((max, obj) => {
        return obj.voltage > max ? obj.voltage : max;
      }, -Infinity);

      // Find minimum voltage
      const minVoltage = objects.reduce((min, obj) => {
        return obj.voltage < min ? obj.voltage : min;
      }, Infinity);

      // Find average voltage
      const sumVoltage = objects.reduce((sum, obj) => {
        return sum + obj.voltage;
      }, 0);
      const avgVoltage = sumVoltage / objects.length;

      // Find midpoint voltage value
      const midpoint = (maxVoltage + minVoltage) / 2;

      // Find rising and falling edges
      let risingEdge = 0;
      let fallingEdge = 0;
      for (let i = 1; i < objects.length; i++) {
        const prevObj = objects[i - 1];
        const obj = objects[i];
        if (prevObj.voltage < midpoint && obj.voltage >= midpoint) {
          risingEdge = obj.time / 1000;
        }
        if (prevObj.voltage >= midpoint && obj.voltage < midpoint) {
          fallingEdge = obj.time / 1000;
        }
      }

      // Find period and frequency
      const period = fallingEdge - risingEdge;
      const frequency = 1 / period;

      if (!isEmpty(portInfo)) {
        setConnected(true);
        dispatch(
          actions.setIsSerialConnected({
            isSerialConnected: true,
          })
        );
      } else {
        setConnected(false);
      }

      if (isPlaying) {
        if (!isEmpty(portInfo)) {
          setChartValues(objects);
          if (typeof frequency === "number" && !isNaN(frequency)) {
            if (frequency > 0) {
              setFrequency(frequency);
            }
          }
          setMaxVoltage(maxVoltage);
          setMinVoltage(minVoltage);
          setAvgVoltage(avgVoltage);
        }
      }
    }, scanRate);

    return () => {
      clearInterval(intervalId);
    };
  }, [scanRate, voltageRef, isPlaying, adc, dispatch]);

  useEffect(() => {
    dispatch(actions.setFrequency(frequency?.toFixed(0)));
    dispatch(actions.setMaxVoltage(maxVoltage?.toFixed(5)));
    dispatch(actions.setMinVoltage(minVoltage?.toFixed(5)));
    dispatch(actions.setAvgVoltage(avgVoltage?.toFixed(5)));
  }, [maxVoltage, minVoltage, avgVoltage, frequency, dispatch]);

  useEffect(() => {
    let intervalId;
    if (!sendStatus) {
      intervalId = setInterval(() => {
        const sendDataToSerial = async () => {
          try {
            let writer = port.writable.getWriter();
            try {
              // convert sendData to Uint8Array
              const hello = new TextEncoder().encode(sendData);
              await writer.write(hello);
              await writer.close();
            } catch (err) {
              console.log(err);
            } finally {
              writer.releaseLock();
            }
          } catch {
            notification.error({
              message: "No Device Selected",
              description: "Please connect device and try again",
            });
            dispatch(actions.setSendStatus(true));
          }
        };
        sendDataToSerial();
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [sendStatus, sendData, dispatch]);

  const reload = () => {
    window.location.reload();
  };

  return (
    <div
      style={{
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div
        className="display-card"
        style={{
          backgroundColor: containerBg,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={connected ? reload : readData}
            type="primary"
            shape="round"
            size="large"
            icon={<PoweroffOutlined />}
            danger={connected}
          >
            {connected ? "Disconnect" : "Connect"}
          </Button>
          {isRecording && (
            <div
              style={{
                marginLeft: "10px",
              }}
            >
              <CSVLink
                data={isEmpty(chartValues) ? [] : chartValues}
                headers={headers}
                filename={"data.csv"}
              >
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  icon={<DownloadOutlined />}
                >
                  Export Data
                </Button>
              </CSVLink>
            </div>
          )}
        </div>

        <div className="info-container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                color: colorText,
                fontSize: "17px",
                fontWeight: "bold",
              }}
            >
              Scan Rate
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <InputNumber
                min={100}
                max={1000}
                step={100}
                style={{
                  fontSize: "17px",
                  fontWeight: "bold",
                  margin: "10px",
                }}
                value={scanRate}
                onChange={onScanRateChange}
              />
              <p
                style={{
                  color: colorText,
                  fontSize: "17px",
                  fontWeight: "bold",
                }}
              >
                ms
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                color: colorText,
                fontSize: "17px",
                fontWeight: "bold",
              }}
            >
              Total Samples
            </p>
            <InputNumber
              value={chartValues?.length}
              min={0}
              max={1000}
              readOnly
              style={{
                margin: "10px",
                fontSize: "17px",
                fontWeight: "bold",
              }}
            ></InputNumber>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                color: colorText,
                fontSize: "17px",
                fontWeight: "bold",
              }}
            >
              ADC Resolution
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Select
                defaultValue="10"
                onChange={(value) => setAdc(value)}
                style={{
                  margin: "10px",
                  fontSize: "17px",
                  fontWeight: "bold",
                }}
              >
                {Object.entries(ADC_OPTIONS).map(([key, option]) => (
                  <Select.Option key={key} value={key}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                color: colorText,
                fontSize: "17px",
                fontWeight: "bold",
              }}
            >
              Voltage Ref
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <InputNumber
                value={voltageRef}
                onChange={(value) => setVoltageRef(value)}
                min={0}
                max={5.2}
                step={0.1}
                style={{
                  margin: "10px",
                  fontSize: "17px",
                  fontWeight: "bold",
                }}
              ></InputNumber>
              <p
                style={{
                  color: colorText,
                  fontSize: "17px",
                  fontWeight: "bold",
                }}
              >
                V
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="display-card"
        style={{
          backgroundColor: containerBg,
          marginTop: "20px",
          height: "400px",
        }}
      >
        <GraphChart data={chartValues} />
      </div>
    </div>
  );
}

export default ReadSerial;
