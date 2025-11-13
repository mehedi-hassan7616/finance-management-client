import { useState, useContext, useId } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { AuthContext } from "@/context/auth-context";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { API_URL } from "@/lib/constant";

const categories = {
  income: ["Salary", "Freelance", "Investment", "Business", "Other"],
  expense: [
    "Food",
    "Transportation",
    "Shopping",
    "Bills",
    "Entertainment",
    "Healthcare",
    "Education",
    "Other",
  ],
};

export default function AddTransactionPage() {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();
  const id = useId();
  const [formData, setFormData] = useState({
    type: "income",
    amount: "35000",
    description: "November salary",
    category: "Salary",
    date: new Date(),
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const transactionData = {
        type: formData.type,
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category,
        date: format(formData.date, "yyyy-MM-dd"),
      };

      await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify(transactionData),
      });

      toast.success("Transaction added successfully!");
      navigate("/transactions");
    } catch (error) {
      console.error("Transaction submission error:", error);
      toast.error("Failed to add transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "type") {
        updated.category = "";
      }
      return updated;
    });
  };

  const availableCategories = categories[formData.type] || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Add Transaction</CardTitle>
          <CardDescription>
            Record a new income or expense transaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-2">
            <fieldset className="space-y-4">
              <legend className="text-sm leading-none font-medium text-foreground">
                Transaction Type
              </legend>
              <RadioGroup
                className="grid grid-cols-2 gap-2"
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                {[
                  { value: "income", label: "Income" },
                  { value: "expense", label: "Expense" },
                ].map((item) => (
                  <div key={`${id}-${item.value}`} className="relative">
                    <RadioGroupItem
                      id={`${id}-${item.value}`}
                      value={item.value}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={`${id}-${item.value}`}
                      className={cn(
                        "flex cursor-pointer flex-col items-center gap-3 rounded-md border border-input px-2 py-3 text-center shadow-xs transition-[color,box-shadow] outline-none hover:border-primary/50 focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
                        formData.type === item.value &&
                          "border-primary bg-primary text-primary-foreground dark:text-primary-foreground"
                      )}
                    >
                      <p
                        className={cn(
                          "text-sm leading-none font-medium text-foreground",
                          formData.type === item.value &&
                            "text-primary-foreground"
                        )}
                      >
                        {item.label}
                      </p>
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </fieldset>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleSelectChange("category", value)}
                disabled={!formData.type}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter transaction description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? (
                      format(formData.date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        date: date || new Date(),
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Adding..." : "Add Transaction"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/transactions")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
