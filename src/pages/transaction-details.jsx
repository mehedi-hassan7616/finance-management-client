import { useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { format } from "date-fns";
import { LoadingSpinner } from "@/components/ui/spinner";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "@/lib/constant";
import { AuthContext } from "@/context/auth-context";

export default function TransactionDetailsPage() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const getTransactions = async () => {
    const res = await fetch(`${API_URL}/transactions/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${user?.accessToken}`,
      },
    });
    return res.json();
  };

  const { data: transactionData, isLoading: isTransactionLoading } = useQuery({
    queryKey: ["transactions", id],
    queryFn: getTransactions,
  });

  const transaction = transactionData?.data;

  if (isTransactionLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">Transaction not found.</p>
            <Link to="/transactions">
              <Button variant="outline">Back to Transactions</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/transactions")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Transactions
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">
                {transaction.description}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge
                  variant={
                    transaction.type === "income" ? "default" : "secondary"
                  }
                >
                  {transaction.type === "income" ? (
                    <ArrowUpCircle className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownCircle className="h-3 w-3 mr-1" />
                  )}
                  {transaction.type}
                </Badge>
                <span>{transaction.category}</span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Amount</p>
              <p
                className={`text-3xl font-bold ${
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}BDT{" "}
                {parseFloat(transaction.amount).toFixed(2)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Date</p>
              <p className="text-lg font-medium">
                {transaction.date
                  ? format(new Date(transaction.date), "MMMM dd, yyyy")
                  : "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Category</p>
              <p className="text-lg font-medium">
                {transaction.category || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Type</p>
              <p className="text-lg font-medium capitalize">
                {transaction.type || "N/A"}
              </p>
            </div>
          </div>

          {transaction.description && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-base">{transaction.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
