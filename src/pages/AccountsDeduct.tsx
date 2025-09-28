// src/pages/AccountsDeduct.tsx
import { Footer } from "@/components/Layout/Footer";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountsDeduct = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState<any>(null);

  // Fetch account details
  useEffect(() => {
    const token = localStorage.getItem("cbiusertoken");
    if (!token) {
      navigate("/auth/login");
      return;
    }

    const fetchAccount = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/amount/balance", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setAccount(data);
        } else {
          toast({ title: "Error", description: "Failed to fetch account", variant: "destructive" });
        }
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "Server error", variant: "destructive" });
      }
    };

    fetchAccount();
  }, [navigate, toast]);

  const handleDeduct = async () => {
    if (!amount || amount <= 0) {
      toast({ title: "Invalid amount", description: "Enter a valid amount greater than 0", variant: "destructive" });
      return;
    }

    const token = localStorage.getItem("cbiusertoken");
    if (!token) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/amount/deduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({ title: "Success", description: data.message });
        setAccount(data.account);
        setAmount("");
      } else {
        toast({ title: "Error", description: data.message, variant: "destructive" });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Server error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-16 max-w-lg">
        <h1 className="text-2xl font-bold mb-6">Deduct Money</h1>
        {account ? (
          <div className="p-4 border rounded mb-6">
            <p>Account Number: {account.accountNumber}</p>
            <p>Balance: ₹{account.balance.toLocaleString()}</p>
          </div>
        ) : (
          <p>Loading account details...</p>
        )}

        <input
          type="number"
          placeholder="Enter amount to deduct"
          className="w-full p-3 border rounded mb-4"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <Button className="w-full" onClick={handleDeduct} disabled={loading}>
          {loading ? "Processing..." : "Deduct Money"}
        </Button>

        <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default AccountsDeduct;
