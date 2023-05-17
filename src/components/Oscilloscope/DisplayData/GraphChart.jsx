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
import PropTypes from "prop-types";
import { theme } from "antd";

function GraphChart({ data }) {
  const {
    token: { graphLine },
  } = theme.useToken();
  return (
    <ResponsiveContainer width="99%" height="100%">
      <LineChart
        data={data}
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
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="voltage" stroke={graphLine} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default GraphChart;

GraphChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.number,
      voltage: PropTypes.number,
    })
  ),
};
