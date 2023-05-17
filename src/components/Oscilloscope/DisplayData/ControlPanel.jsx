import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { theme, Form, Input, Tag, Button, Checkbox, Modal } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import actions from "../../../config/actions/actions";
import WaveGenerator from "../GenerateWave/GenerateWave";

const ControlPanel = () => {
  const {
    token: { containerBg, colorText },
  } = theme.useToken();

  const dispatch = useDispatch();
  const isSerialConnected = useSelector((state) => state.isSerialConnected);
  const frequency = useSelector((state) => state.frequency);
  const maxVoltage = useSelector((state) => state.maxVoltage);
  const averageVoltage = useSelector((state) => state.avgVoltage);
  const minVoltage = useSelector((state) => state.minVoltage);
  const isPlaying = useSelector((state) => state.isPlaying);
  const isRecording = useSelector((state) => state.isRecording);

  const [isPaused, setIsPaused] = useState(false);
  const [isRecord, setIsRecord] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePause = () => {
    setIsPaused(!isPaused);
    dispatch(actions.setIsPlaying(!isPlaying));
  };

  const handleRecord = () => {
    setIsRecord(!isRecord);
    dispatch(actions.setIsRecording(!isRecording));
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      style={{
        padding: "15px",
      }}
    >
      <div
        className="display-card"
        style={{
          backgroundColor: containerBg,
          height: "605px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Tag
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50px",
              marginBottom: "10px",
              width: "100%",
            }}
            color={isSerialConnected ? "green" : "red"}
            icon={
              isSerialConnected ? (
                <CheckCircleOutlined />
              ) : (
                <CloseCircleOutlined />
              )
            }
          >
            {isSerialConnected ? "Connected" : "Disconnected"}
          </Tag>
          <Form layout="vertical">
            <Form.Item
              label="Frequency"
              style={{
                color: colorText,
                fontSize: "17px",
                fontWeight: "bold",
              }}
            >
              <Input
                value={isNaN(frequency) ? "0.00 Hz" : frequency + "Hz"}
                readOnly
                style={{ width: "100%", fontSize: "17px", fontWeight: "bold" }}
              />
            </Form.Item>
            <Form.Item
              label="Maximum Voltage"
              style={{
                color: colorText,
                fontSize: "17px",
                fontWeight: "bold",
              }}
            >
              <Input
                value={isNaN(maxVoltage) ? "0.00 V" : maxVoltage + " V"}
                readOnly
                style={{ width: "100%", fontSize: "17px", fontWeight: "bold" }}
              />
            </Form.Item>
            <Form.Item
              label="Minimum Voltage"
              style={{
                color: colorText,
                fontSize: "17px",
                fontWeight: "bold",
              }}
            >
              <Input
                value={isNaN(minVoltage) ? "0.00 V" : minVoltage + " V"}
                readOnly
                style={{ width: "100%", fontSize: "17px", fontWeight: "bold" }}
              />
            </Form.Item>
            <Form.Item
              label="Average Volatge"
              style={{
                color: colorText,
                fontSize: "17px",
                fontWeight: "bold",
              }}
            >
              <Input
                value={isNaN(averageVoltage) ? "0.00 V" : averageVoltage + " V"}
                readOnly
                style={{ width: "100%", fontSize: "17px", fontWeight: "bold" }}
              />
            </Form.Item>
          </Form>
          <Checkbox
            checked={isRecord}
            onChange={handleRecord}
            style={{
              color: colorText,
              fontSize: "16px",
              fontWeight: "bold",
              width: "100%",
            }}
          >
            Record
          </Checkbox>
          <Button
            type="primary"
            shape="round"
            icon={isPaused ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
            onClick={handlePause}
            style={{ width: "100%", marginTop: "10px" }}
          />
          <Button
            type="primary"
            onClick={showModal}
            style={{ width: "100%", marginTop: "10px" }}
          >
            Generate Wave
          </Button>
          <Modal
            title="WAVE GENERATOR"
            footer={null}
            open={isModalOpen}
            onCancel={handleCancel}
            closeIcon={
              <CloseCircleOutlined
                style={{ color: colorText, fontSize: "1.5rem" }}
              />
            }
            width={900}
          >
            <WaveGenerator />
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
