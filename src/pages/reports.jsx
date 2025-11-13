import { useContext, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, PieChart, TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "@/context/auth-context";
import { API_URL } from "@/lib/constant";
import { LoadingSpinner } from "@/components/ui/spinner";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Chart colors that adapt to theme
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7300",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
];

export default function ReportsPage() {
  const { user } = useContext(AuthContext);

  const getReportsData = async () => {
    const res = await fetch(`${API_URL}/reports`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    return res.json();
  };

  const {
    data: reportsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["reports"],
    queryFn: getReportsData,
    enabled: !!user?.accessToken,
  });

  const summary = reportsData?.data?.summary || {
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
  };

  const monthlyData = useMemo(
    () => reportsData?.data?.monthlyData || [],
    [reportsData?.data?.monthlyData]
  );

  const categoryData = useMemo(
    () => reportsData?.data?.categoryData || [],
    [reportsData?.data?.categoryData]
  );

  const totalIncome = summary.totalIncome;
  const totalExpenses = summary.totalExpenses;
  const netBalance = summary.netBalance;

  const incomeColor = "hsl(142, 71%, 45%)"; // Green
  const expenseColor = "hsl(0, 84%, 60%)"; // Red

  const pieChartData = useMemo(() => {
    return categoryData.map((item, index) => ({
      ...item,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [categoryData]);

  const chartConfig = useMemo(() => {
    const config = {};
    categoryData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
    });
    return config;
  }, [categoryData]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-2">
              Failed to load reports data.
            </p>
            <p className="text-sm text-muted-foreground">
              {error?.message || "Please try again later."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Reports</h1>
          <p className="text-muted-foreground">
            Financial summary and analytics
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
        {/* Bar Chart - Monthly Totals */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg md:text-xl">
                Monthly Income vs Expenses
              </CardTitle>
            </div>
            <CardDescription className="text-xs md:text-sm">
              Bar chart showing monthly totals
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {monthlyData.length > 0 ? (
              <ChartContainer
                config={{
                  income: {
                    label: "Income",
                    color: incomeColor,
                  },
                  expenses: {
                    label: "Expenses",
                    color: expenseColor,
                  },
                }}
                className="h-[300px] md:h-[350px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      opacity={0.3}
                    />
                    <XAxis
                      dataKey="monthLabel"
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12,
                      }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12,
                      }}
                      tickFormatter={(value) =>
                        `BDT ${(value / 1000).toFixed(0)}k`
                      }
                    />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        return (
                          <div className="rounded-lg border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
                            <div className="grid gap-2">
                              {payload.map((entry, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between gap-4"
                                >
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="h-2.5 w-2.5 rounded-full"
                                      style={{ backgroundColor: entry.color }}
                                    />
                                    <span className="text-sm font-medium text-foreground">
                                      {entry.name}
                                    </span>
                                  </div>
                                  <span className="text-sm font-bold text-foreground">
                                    BDT {entry.value?.toFixed(2) || 0}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar
                      dataKey="income"
                      fill={incomeColor}
                      radius={[4, 4, 0, 0]}
                      name="Income"
                    />
                    <Bar
                      dataKey="expenses"
                      fill={expenseColor}
                      radius={[4, 4, 0, 0]}
                      name="Expenses"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] md:h-[350px] flex items-center justify-center text-muted-foreground border rounded-lg bg-muted/50">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart - Category Breakdown */}
        <Card className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg md:text-xl">
                Category Breakdown
              </CardTitle>
            </div>
            <CardDescription className="text-xs md:text-sm">
              Pie chart showing income and expense distribution by category
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {categoryData.length > 0 ? (
              <ChartContainer
                config={chartConfig}
                className="h-[300px] md:h-[350px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const data = payload[0];
                        const total = categoryData.reduce(
                          (sum, cat) => sum + cat.value,
                          0
                        );
                        const percentage =
                          total > 0
                            ? ((data.value / total) * 100).toFixed(1)
                            : 0;
                        return (
                          <div className="rounded-lg border bg-background/95 backdrop-blur-sm p-3 shadow-lg">
                            <div className="grid gap-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-2.5 w-2.5 rounded-full"
                                  style={{ backgroundColor: data.payload.fill }}
                                />
                                <span className="text-sm font-medium text-foreground">
                                  {data.name}
                                </span>
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-xl md:text-2xl font-bold text-foreground">
                                  BDT {data.value.toFixed(2)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  ({percentage}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percent }) => {
                        if (percent < 0.05) return ""; // Hide labels for very small slices
                        return `${(percent * 100).toFixed(0)}%`;
                      }}
                      outerRadius="70%"
                      innerRadius="30%"
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.fill}
                          stroke="hsl(var(--background))"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Legend
                      verticalAlign="bottom"
                      height={60}
                      iconType="circle"
                      wrapperStyle={{
                        fontSize: "12px",
                        paddingTop: "10px",
                      }}
                      formatter={(value) => (
                        <span
                          className="text-xs md:text-sm"
                          style={{ color: "hsl(var(--foreground))" }}
                        >
                          {value}
                        </span>
                      )}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] md:h-[350px] flex items-center justify-center text-muted-foreground border rounded-lg bg-muted/50">
                <div className="text-center">
                  <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No transaction data available</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">
            Financial Summary
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Overall financial summary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 md:space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900/30">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="font-medium text-sm md:text-base">
                  Total Income
                </span>
              </div>
              <span className="font-bold text-base md:text-lg text-green-600 dark:text-green-400">
                BDT {totalIncome.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900/30">
              <div className="flex items-center gap-3">
                <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="font-medium text-sm md:text-base">
                  Total Expenses
                </span>
              </div>
              <span className="font-bold text-base md:text-lg text-red-600 dark:text-red-400">
                BDT {totalExpenses.toFixed(2)}
              </span>
            </div>

            <div className="border-t border-border pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
              <span className="font-semibold text-base md:text-lg">
                Net Balance
              </span>
              <span
                className={`font-bold text-xl md:text-2xl ${
                  netBalance >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                BDT {netBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
