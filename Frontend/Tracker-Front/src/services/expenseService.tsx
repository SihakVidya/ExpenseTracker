// src/services/expenseService.ts
import axios from "axios";

const API_URL = "http://localhost:5000/api/expenses";

export interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
}

export const getExpenses = () => axios.get<Expense[]>(API_URL);
export const addExpense = (expense: Omit<Expense, "id" | "date">) =>
  axios.post(API_URL, expense);
export const deleteExpense = (id: number) => axios.delete(`${API_URL}/${id}`);
export const updateExpense = async (expense: Expense) => {
  return await axios.put(`${API_URL}/${expense.id}`, expense);
};
