import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function PriceChart({
  providers,
  coinPrice,
}: {
  providers: { name: string; price: number }[];
  coinPrice: number;
}) {
  const averagePrice =
    providers.reduce(
      (acc, curr) => acc + ((curr.price * 438000) / 1000000) * coinPrice,
      0
    ) / providers.length;

  const prices = providers
    .map((provider) => ((provider.price * 438000) / 1000000) * coinPrice)
    .sort((a, b) => a - b);
  const mid = Math.floor(prices.length / 2);
  const medianPrice =
    prices.length % 2 !== 0 ? prices[mid] : (prices[mid - 1] + prices[mid]) / 2;

  const countUntilMedian = prices.filter(
    (price) => price <= medianPrice
  ).length;
  const data = {
    labels: providers.map((provider) =>
      provider?.name?.replace("provider.", "")
    ),
    datasets: [
      {
        label: "Price (USD/hr)",
        data: providers.map(
          (provider) =>
            ((provider.price * 438000) / 1000000) * Number(coinPrice.toFixed(1))
        ),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top" as
          | "top"
          | "left"
          | "right"
          | "bottom"
          | "center"
          | "chartArea",
      },
      title: {
        display: true,
        text: "Provider Prices Comparison",
      },
    },
  };

  return (
    <div className="flex flex-col gap-4 max-[90%]">
      <div className="flex gap-4 m-auto">
        <div>Average Price: {averagePrice.toFixed(1)}</div>
        <div>Median Price: {medianPrice.toFixed(1)}</div>
        <div>Count until median: {countUntilMedian}</div>
      </div>
      <Bar data={data} options={options} />;
    </div>
  );
}

// Then use the <PriceChart /> component in your render method where appropriate
