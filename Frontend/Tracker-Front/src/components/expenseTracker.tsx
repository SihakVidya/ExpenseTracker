import { useEffect, useState } from "react";
import {
  getExpenses,
  addExpense,
  deleteExpense,
  updateExpense, // Add this import
  Expense,
} from "../services/expenseService";
import { Button } from "@/components/ui/button";
import { MdDeleteForever, MdEdit } from "react-icons/md"; // Add edit icon
import { FaRegEdit } from "react-icons/fa";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast"; // Import the useToast hook

const ExpenseTracker = () => {
  const { toast } = useToast(); // Initialize toast
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // New state for edit dialog
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await getExpenses();
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, []);

  const handleAddExpense = async () => {
    if (!description || !amount || !date) return;
    const newExpense = { description, amount: parseFloat(amount), date };
    try {
      await addExpense(newExpense);
      setDescription("");
      setAmount("");
      setDate("");
      setIsDialogOpen(false);
      const response = await getExpenses();
      setExpenses(response.data);

      // Show success toast
      toast({
        title: "Expense Added",
        description: "Your expense was added successfully!",
      });
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleEditExpense = async () => {
    if (!selectedExpenseId || !description || !amount || !date) return;
    const updatedExpense = {
      id: selectedExpenseId,
      description,
      amount: parseFloat(amount),
      date,
    };
    try {
      await updateExpense(updatedExpense);
      setDescription("");
      setAmount("");
      setDate("");
      setIsEditDialogOpen(false);
      const response = await getExpenses();
      setExpenses(response.data);

      // Show success toast
      toast({
        title: "Expense Updated",
        description: "Your expense was updated successfully!",
      });
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  const handleDeleteExpense = async () => {
    if (selectedExpenseId === null) return;
    try {
      await deleteExpense(selectedExpenseId);
      setIsConfirmDialogOpen(false);
      const response = await getExpenses();
      setExpenses(response.data);
      setSelectedExpenseId(null);
      toast({
        variant: "destructive",
        title: "Expense Deleted",
        description: "Your expense was deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const openEditDialog = (expense: Expense) => {
    setSelectedExpenseId(expense.id);
    setDescription(expense.description);
    setAmount(expense.amount.toString());
    setDate(expense.date);
    setIsEditDialogOpen(true);
  };

  const openConfirmDialog = (expenseId: number) => {
    setSelectedExpenseId(expenseId);
    setIsConfirmDialogOpen(true);
  };

  return (
    <div className="flex justify-center">
      <div className="flex-col items-center w-full max-w-2xl">
        <h1 className="p-5 bg-slate-950 text-white text-center mt-10 rounded-md text-xl mx-auto">
          Expense Tracker
        </h1>

        <Table className="mt-10 mx-auto w-full">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.id}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>${expense.amount}</TableCell>
                <TableCell>
                  {new Date(expense.date).toISOString().slice(0, 10)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    onClick={() => openConfirmDialog(expense.id)}
                    className="mr-2"
                  >
                    <MdDeleteForever />
                  </Button>
                  <Button onClick={() => openEditDialog(expense)}>
                    <FaRegEdit />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Dialog to Add Expense */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className="flex justify-end mt-4">
            <DialogTrigger asChild>
              <Button variant="outline">Add Expense</Button>
            </DialogTrigger>
          </div>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddExpense}>Save Expense</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Expense Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditExpense}>Update Expense</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog for Deletion */}
        <Dialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>
                Do you really want to delete this expense? This action cannot be
                undone.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsConfirmDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteExpense}>
                Confirm Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ExpenseTracker;
