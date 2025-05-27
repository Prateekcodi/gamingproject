// StudyChart.tsx using Recharts
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { DailyStats } from "../types";

interface StudyChartProps {
  dailyStats: DailyStats[];
}

const formatTimeLabel = (minutes: number) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs > 0 ? hrs + " hr " : ""}${mins > 0 ? mins + " min" : "0 min"}`;
};

const StudyChart: React.FC<StudyChartProps> = ({ dailyStats }) => {
  const chartData = dailyStats.map((day) => ({
    name: new Date(day.date).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    minutes: day.totalMinutes,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="name" stroke="#555" />
        <YAxis
          stroke="#555"
          tickFormatter={(min) => formatTimeLabel(min)}
          interval={0}
        />
        <Tooltip
          formatter={(value: any) => formatTimeLabel(value)}
          labelStyle={{ fontWeight: "bold" }}
        />
        <Bar dataKey="minutes" fill="#6366F1" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StudyChart;
