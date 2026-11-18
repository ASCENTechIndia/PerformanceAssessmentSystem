
import React from "react";
import ReactECharts from "echarts-for-react";
import { Panel } from "./DashboardUI";

const chartHeight = "300px";

// 1. Department-wise Task Performance
export const DepartmentTaskChart = ({ data = [] }) => {
  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
    },
    legend: {
      bottom: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { fontSize: 11 },
    },
    grid: {
      top: 20,
      left: 10,
      right: 15,
      bottom: 45,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.map((item) => item.department),
      axisLabel: {
        fontSize: 10,
        interval: 0,
        rotate: 0,
      },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: "#e5e7eb" } },
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      axisLabel: { fontSize: 10 },
      splitLine: { lineStyle: { color: "#f1f5f9" } },
    },
    series: [
      {
        name: "Completed",
        type: "bar",
        data: data.map((item) => item.completed),
        itemStyle: {
          color: "#10b981",
          borderRadius: [4, 4, 0, 0],
        },
        barMaxWidth: 28,
      },
      {
        name: "Pending",
        type: "bar",
        data: data.map((item) => item.pending),
        itemStyle: {
          color: "#f59e0b",
          borderRadius: [4, 4, 0, 0],
        },
        barMaxWidth: 28,
      },
    ],
  };

  return (
    <Panel title="Department-wise Task Performance">
      <ReactECharts
        option={option}
        style={{ height: chartHeight, width: "100%" }}
        notMerge
        lazyUpdate
      />
    </Panel>
  );
};

// 2. Monthly Task Creation vs Completion
export const MonthlyTaskChart = ({ data = [] }) => {
  const option = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      bottom: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { fontSize: 11 },
    },
    grid: {
      top: 20,
      left: 10,
      right: 15,
      bottom: 45,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((item) => item.month),
      axisLabel: { fontSize: 10 },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: "#e5e7eb" } },
    },
    yAxis: {
      type: "value",
      minInterval: 1,
      axisLabel: { fontSize: 10 },
      splitLine: { lineStyle: { color: "#f1f5f9" } },
    },
    series: [
      {
        name: "Created",
        type: "line",
        data: data.map((item) => item.created),
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { width: 3, color: "#3b82f6" },
        itemStyle: { color: "#3b82f6" },
      },
      {
        name: "Completed",
        type: "line",
        data: data.map((item) => item.completed),
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { width: 3, color: "#10b981" },
        itemStyle: { color: "#10b981" },
      },
    ],
  };

  return (
    <Panel title="Monthly Task Creation vs Completion">
      <ReactECharts
        option={option}
        style={{ height: chartHeight, width: "100%" }}
        notMerge
        lazyUpdate
      />
    </Panel>
  );
};

// 3. Priority-wise Task Distribution
export const PriorityTaskChart = ({ data = [] }) => {
  const totalTasks = data.reduce(
    (total, item) => total + Number(item.value || 0),
    0
  );

  const priorityColors = {
    High: "#ef4444",
    Medium: "#f59e0b",
    Low: "#3b82f6",
  };

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      bottom: 0,
      left: "center",
      itemWidth: 10,
      itemHeight: 10,
      textStyle: { fontSize: 11 },
    },
    series: [
      {
        name: "Tasks by Priority",
        type: "pie",
        radius: ["48%", "72%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 5,
          borderColor: "#ffffff",
          borderWidth: 3,
        },
        label: {
          show: false,
        },
        emphasis: {
          scale: true,
          scaleSize: 8,
          label: {
            show: true,
            fontSize: 12,
            fontWeight: "bold",
            formatter: "{b}\n{c}",
          },
        },
        data: data.map((item) => ({
          name: item.priority,
          value: Number(item.value || 0),
          itemStyle: {
            color: priorityColors[item.priority] || "#94a3b8",
          },
        })),
      },
    ],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "38%",
        style: {
          text: `${totalTasks}\nTotal Tasks`,
          textAlign: "center",
          fill: "#334155",
          fontSize: 13,
          fontWeight: 600,
          lineHeight: 22,
        },
      },
    ],
  };

  return (
    <Panel title="Priority-wise Task Distribution">
      <ReactECharts
        option={option}
        style={{ height: chartHeight, width: "100%" }}
        notMerge
        lazyUpdate
      />
    </Panel>
  );
};
