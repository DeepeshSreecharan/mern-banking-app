import { Footer } from "@/components/Layout/Footer";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import apiService from "@/lib/api";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Transaction {
  id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  date: string;
  status: string;
}

const Transactions = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // pagination + filters
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [type, setType] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await apiService.getTransactions({
        page,
        limit,
        type,
        startDate,
        endDate,
      });

      // backend response expected: { transactions: [...], totalPages: X }
      const formatted = (res.transactions || []).map((t: any) => ({
        id: t._id || t.id,
        type: t.type.toLowerCase(),
        amount: t.amount,
        description: t.description || (t.type === "credit" ? "Money Credited" : "Money Debited"),
        date: new Date(t.createdAt || t.date).toLocaleDateString(),
        status: t.status || "Completed",
      }));

      setTransactions(formatted);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error("❌ Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, type, startDate, endDate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-8 space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">All Transactions</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="debit">Debit</SelectItem>
            </SelectContent>
          </Select>

          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

          <Button variant="secondary" onClick={() => { setStartDate(""); setEndDate(""); setType(""); setPage(1); }}>
            Reset
          </Button>
        </div>

        {/* Transaction list */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Complete history of your account</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground text-center py-4">Loading transactions...</p>
            ) : transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          t.type === "credit" ? "bg-success/20" : "bg-warning/20"
                        }`}
                      >
                        {t.type === "credit" ? (
                          <ArrowDownRight className="h-4 w-4 text-success" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-warning" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{t.description}</p>
                        <p className="text-sm text-muted-foreground">{t.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          t.type === "credit" ? "text-success" : "text-warning"
                        }`}
                      >
                        {t.type === "credit" ? "+" : "-"}₹{t.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">{t.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No transactions found.</p>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex justify-center space-x-4">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="self-center">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Transactions;
