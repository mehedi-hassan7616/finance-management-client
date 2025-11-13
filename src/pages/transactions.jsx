import { useState, useContext, useId } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { AuthContext } from "@/context/auth-context";
import {
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  ArrowUpCircle,
  ArrowDownCircle,
  CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { API_URL } from "@/lib/constant";
import { useQuery } from "@tanstack/react-query";

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

export default function TransactionsPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const id = useId();
  const [filter, setFilter] = useState("all");
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    type: "",
    amount: "",
    description: "",
    category: "",
    date: null,
  });

  const getTransactions = async () => {
    const res = await fetch(`${API_URL}/transactions?type=${filter}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    return res.json();
  };

  const {
    data: transactionData,
    isLoading: isTransactionLoading,
    refetch,
  } = useQuery({
    queryKey: ["transactions", filter],
    queryFn: getTransactions,
  });

  const transactions = transactionData?.data || [];

  const handleViewDetails = (transaction) => {
    navigate(`/transactions/${transaction?._id}`);
  };

  const handleOpenUpdate = (transaction) => {
    setSelectedTransaction(transaction);
    setUpdateFormData({
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      date: new Date(transaction.date),
    });
    setUpdateDialogOpen(true);
  };

  const handleOpenDelete = (transaction) => {
    setSelectedTransaction(transaction);
    setDeleteDialogOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log(updateFormData);

    try {
      await fetch(`${API_URL}/transactions/${selectedTransaction?._id}`, {
        method: "PATCH",
        body: JSON.stringify(updateFormData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      refetch();

      toast.success("Transaction updated successfully!");
      setUpdateDialogOpen(false);
      setUpdateFormData({
        type: "",
        amount: "",
        description: "",
        category: "",
        date: null,
      });
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update transaction. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${API_URL}/transactions/${selectedTransaction?._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });

      refetch();

      toast.success("Transaction deleted successfully!");
      setDeleteDialogOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete transaction.");
    }
  };

  const handleUpdateFormChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSelectChange = (name, value) => {
    setUpdateFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "type") {
        updated.category = "";
      }
      return updated;
    });
  };

  const availableCategories = categories[updateFormData.type] || [];

  if (isTransactionLoading && transactions?.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">My Transactions</h1>
        <Link to="/add-transaction">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Transaction
          </Button>
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
        >
          All
        </Button>
        <Button
          variant={filter === "income" ? "default" : "outline"}
          onClick={() => setFilter("income")}
        >
          Income
        </Button>
        <Button
          variant={filter === "expense" ? "default" : "outline"}
          onClick={() => setFilter("expense")}
        >
          Expense
        </Button>
      </div>

      {transactions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-2">No transactions found.</p>
            <p className="text-sm text-muted-foreground mb-4">
              Start by adding your first transaction!
            </p>
            <Link to="/add-transaction">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transactions.map((transaction) => (
            <Card
              key={transaction?._id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-1 line-clamp-1">
                      {transaction?.description}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          transaction?.type === "income"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {transaction?.type === "income" ? (
                          <ArrowUpCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownCircle className="h-3 w-3 mr-1" />
                        )}
                        {transaction?.type}
                      </Badge>
                      <span>{transaction?.category}</span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Amount</p>
                    <p
                      className={`text-2xl font-bold ${
                        transaction?.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction?.type === "income" ? "+" : "-"}BDT{" "}
                      {parseFloat(transaction?.amount).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Date</p>
                    <p className="text-sm font-medium">
                      {transaction?.date
                        ? format(new Date(transaction?.date), "MMM dd, yyyy")
                        : "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewDetails(transaction)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenUpdate(transaction)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Update
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleOpenDelete(transaction)}
                      // disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Update Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">
              Update Transaction
            </DialogTitle>
            <DialogDescription>Edit transaction details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-2">
            <fieldset className="space-y-4">
              <legend className="text-sm leading-none font-medium text-foreground">
                Transaction Type
              </legend>
              <RadioGroup
                className="grid grid-cols-2 gap-2"
                value={updateFormData.type}
                onValueChange={(value) =>
                  handleUpdateSelectChange("type", value)
                }
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
                        updateFormData.type === item.value &&
                          "border-primary bg-primary text-primary-foreground dark:text-primary-foreground"
                      )}
                    >
                      <p
                        className={cn(
                          "text-sm leading-none font-medium text-foreground",
                          updateFormData.type === item.value &&
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
              <Label htmlFor="update-category">Category</Label>
              <Select
                value={updateFormData.category}
                onValueChange={(value) =>
                  handleUpdateSelectChange("category", value)
                }
                disabled={!updateFormData.type}
              >
                <SelectTrigger id="update-category">
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
              <Label htmlFor="update-amount">Amount</Label>
              <Input
                id="update-amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={updateFormData.amount}
                onChange={handleUpdateFormChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="update-description">Description</Label>
              <Textarea
                id="update-description"
                name="description"
                placeholder="Enter transaction description"
                value={updateFormData.description}
                onChange={handleUpdateFormChange}
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
                      !updateFormData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {updateFormData.date ? (
                      format(updateFormData.date, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={updateFormData.date}
                    onSelect={(date) =>
                      setUpdateFormData((prev) => ({
                        ...prev,
                        date: date || new Date(),
                      }))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <DialogFooter className="pt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUpdateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                // disabled={loading}
              >
                {/* {loading ? "Updating..." : "Update Transaction"} */}
                Update Transaction
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction{" "}
              <span className="font-semibold">
                "{selectedTransaction?.description}"
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
            // disabled={loading}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              // disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {/* {loading ? "Deleting..." : "Delete"} */}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
