import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button, InputNumber, Select, theme } from "antd";
import squareWave from "../../../waves/squareWave";
import sineWave from "../../../waves/sineWave";
import triangleWave from "../../../waves/triangleWave";
import sawtoothWave from "../../../waves/sawtoothWave";
import actions from "../../../config/actions/actions";
import { useDispatch, useSelector } from "react-redux";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  SendOutlined,
  StopOutlined,
} from "@ant-design/icons";

const WaveGenerator = () => {
  const {
    token: { colorText, colorTooltip },
  } = theme.useToken();

  const dispatch = useDispatch();
  const [waveType, setWaveType] = useState("sine");
  const [cycles, setCycles] = useState(5);
  const [frequency, setFrequency] = useState(50);
  const [dutyCycle, setDutyCycle] = useState(50);
  const [wave, setWave] = useState([]);
  const [sendStatus, setSendStatus] = useState(true);
  const [preview, setPreview] = useState(false);
  const sendData = useSelector((state) => state.sendWaveData);

  // function to generate a wave based on the current state
  const generateWave = () => {
    if (waveType === "sine") {
      setWave(sineWave(frequency, cycles));
    } else if (waveType === "square") {
      setWave(squareWave(frequency, dutyCycle, cycles));
    } else if (waveType === "triangle") {
      setWave(triangleWave(frequency, cycles));
    } else if (waveType === "sawtooth") {
      setWave(sawtoothWave(frequency, cycles));
    }
  };

  //   function to handle wave type input change
  const handleWaveTypeChange = (value) => {
    setWaveType(value);
    generateWave();
  };

  // function to handle cycles input change
  const handleCycleChange = (value) => {
    setCycles(value);
    generateWave();
  };

  // function to handle frequency input change
  const handleFrequencyChange = (value) => {
    setFrequency(value);
    generateWave();
  };

  // function to handle duty cycle input change
  const handleDutyCycleChange = (value) => {
    setDutyCycle(value);
    generateWave();
  };

  // function to handle send wave button click
  const handleSendWave = () => {
    setSendStatus(!sendStatus);
    dispatch(actions.setSendStatus(!sendStatus));
  };

  useEffect(() => {
    if (waveType === "sine") {
      dispatch(actions.sendWaveData("sine:" + frequency));
    }
    if (waveType === "square") {
      dispatch(actions.sendWaveData("square:" + dutyCycle));
    }
    if (waveType === "triangle") {
      dispatch(actions.sendWaveData("triangle:" + frequency));
    }
    if (waveType === "sawtooth") {
      dispatch(actions.sendWaveData("sawtooth:" + frequency));
    }
  }, [sendStatus, waveType, frequency, dutyCycle, dispatch, sendData]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="info-container">
          <div
            className="info-container"
            style={{
              marginLeft: "20px",
            }}
          >
            <p
              style={{
                color: colorText,
                fontWeight: "bold",
              }}
            >
              Wave Type:
            </p>
            <Select
              defaultValue="sine"
              onChange={handleWaveTypeChange}
              style={{
                marginLeft: "10px",
                width: "120px",
              }}
            >
              <Select.Option value="sine">Sine</Select.Option>
              <Select.Option value="square">Square</Select.Option>
              <Select.Option value="triangle">Triangle</Select.Option>
              <Select.Option value="sawtooth">Sawtooth</Select.Option>
            </Select>
          </div>
          <div
            className="info-container"
            style={{
              marginLeft: "20px",
            }}
          >
            <p
              style={{
                color: colorText,
                fontWeight: "bold",
              }}
            >
              Cycles:
            </p>
            <InputNumber
              value={cycles}
              onChange={handleCycleChange}
              style={{
                marginLeft: "10px",
              }}
            />
          </div>
          <div
            className="info-container"
            style={{
              marginLeft: "20px",
            }}
          >
            <p
              style={{
                color: colorText,
                fontWeight: "bold",
              }}
            >
              Frequency:
            </p>
            <InputNumber
              value={frequency}
              onChange={handleFrequencyChange}
              style={{
                marginLeft: "10px",
              }}
            />
          </div>
          {waveType === "square" && (
            <div
              className="info-container"
              style={{
                marginLeft: "20px",
              }}
            >
              <p
                style={{
                  color: colorText,
                  fontWeight: "bold",
                }}
              >
                Duty Cycle:
              </p>
              <InputNumber
                value={dutyCycle}
                onChange={handleDutyCycleChange}
                style={{
                  marginLeft: "10px",
                }}
              />
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              margin: "15px",
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                setPreview(!preview);
                generateWave();
              }}
              icon={preview ? <EyeInvisibleOutlined /> : <EyeOutlined />}
              danger={preview}
            >
              {preview ? "Hide Preview" : "Show Preview"}
            </Button>
          </div>
          <div
            style={{
              margin: "15px",
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              onClick={handleSendWave}
              danger={!sendStatus}
              icon={sendStatus ? <SendOutlined /> : <StopOutlined />}
            >
              {sendStatus ? "Send Wave" : "Stop Sending"}
            </Button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {preview && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={wave}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="6 6" />
              <XAxis
                dataKey="time"
                type="number"
                label={{
                  value: "Time (ms)",
                  position: "insideBottomRight",
                  offset: -10,
                  dy: 10,
                }}
              />
              <YAxis
                label={{
                  value: "Voltage (V)",
                  angle: -90,
                  position: "insideLeft",
                  dx: -10,
                }}
                domain={[-6, 6]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: colorTooltip,
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="voltage" stroke="#d4b106" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default WaveGenerator;
