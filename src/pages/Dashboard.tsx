import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const dummyExpenses = [
    { id: 1, date: '2025-01-05', category: 'Food', description: 'Grocery shopping', amount: 85.50 },
    { id: 2, date: '2025-01-04', category: 'Transportation', description: 'Gas station', amount: 45.00 },
    { id: 3, date: '2025-01-03', category: 'Entertainment', description: 'Movie tickets', amount: 25.00 },
    { id: 4, date: '2025-01-02', category: 'Utilities', description: 'Electricity bill', amount: 120.00 },
    { id: 5, date: '2025-01-01', category: 'Food', description: 'Restaurant dinner', amount: 65.00 },
  ];

  const totalExpenses = dummyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Welcome back, {user?.username || 'User'}! 👋
            </h1>
            <p className="text-muted-foreground mt-2">Here's your expense overview</p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Expense
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardDescription>Total Expenses</CardDescription>
              <CardTitle className="text-3xl font-bold text-primary">
                ${totalExpenses.toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-card">
            <CardHeader>
              <CardDescription>This Month</CardDescription>
              <CardTitle className="text-3xl font-bold text-accent">
                ${totalExpenses.toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="shadow-card">
            <CardHeader>
              <CardDescription>Transactions</CardDescription>
              <CardTitle className="text-3xl font-bold text-foreground">
                {dummyExpenses.length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.date}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {expense.category}
                      </span>
                    </TableCell>
                    <TableCell>{expense.description}</TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      ${expense.amount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
