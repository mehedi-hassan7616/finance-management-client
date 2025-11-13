import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BarChart3, PieChart, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";

export default function ReportsPage() {
  const [filterMonth, setFilterMonth] = useState(format(new Date(), "yyyy-MM"));
  const [filterCategory, setFilterCategory] = useState("all");

  // TODO: Replace with actual data from database
  const totalIncome = 0;
  const totalExpenses = 0;
  const netBalance = totalIncome - totalExpenses;

  // Generate months for filter
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push({
      value: format(date, "yyyy-MM"),
      label: format(date, "MMMM yyyy"),
    });
  }

  const categories = [
    "Food",
    "Transportation",
    "Shopping",
    "Bills",
    "Entertainment",
    "Healthcare",
    "Education",
    "Other",
  ];

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

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter reports by month or category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Month</Label>
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger id="month">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Bar Chart - Monthly Totals */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <CardTitle>Monthly Income vs Expenses</CardTitle>
            </div>
            <CardDescription>Bar chart showing monthly totals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground border rounded-lg bg-muted/50">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Chart placeholder</p>
                <p className="text-xs mt-1">
                  Implement with chart library (e.g., Recharts, Chart.js)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pie Chart - Category Breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              <CardTitle>Category Breakdown</CardTitle>
            </div>
            <CardDescription>
              Pie chart showing expense distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-muted-foreground border rounded-lg bg-muted/50">
              <div className="text-center">
                <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Chart placeholder</p>
                <p className="text-xs mt-1">
                  Implement with chart library (e.g., Recharts, Chart.js)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
          <CardDescription>
            Summary for {format(new Date(filterMonth + "-01"), "MMMM yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium">Total Income</span>
              </div>
              <span className="font-bold text-lg text-green-600">
                ${totalIncome.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <span className="font-medium">Total Expenses</span>
              </div>
              <span className="font-bold text-lg text-red-600">
                ${totalExpenses.toFixed(2)}
              </span>
            </div>

            <div className="border-t pt-4 flex justify-between items-center">
              <span className="font-semibold text-lg">Net Balance</span>
              <span
                className={`font-bold text-2xl ${
                  netBalance >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                ${netBalance.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
