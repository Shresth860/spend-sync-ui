import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Analytics = () => {
  const categoryData = [
    { category: 'Food', amount: 150.50 },
    { category: 'Transportation', amount: 45.00 },
    { category: 'Entertainment', amount: 25.00 },
    { category: 'Utilities', amount: 120.00 },
  ];

  const monthlyData = [
    { month: 'Jan', expenses: 340.50 },
    { month: 'Feb', expenses: 420.00 },
    { month: 'Mar', expenses: 380.00 },
    { month: 'Apr', expenses: 450.00 },
    { month: 'May', expenses: 340.50 },
  ];

  const COLORS = ['hsl(200, 95%, 45%)', 'hsl(165, 80%, 50%)', 'hsl(220, 15%, 45%)', 'hsl(0, 84%, 60%)'];

  return (
    <div className="p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Analytics 📊</h1>
          <p className="text-muted-foreground mt-2">Visualize your spending patterns</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>Distribution of your spending</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>Your spending over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="expenses" fill="hsl(200, 95%, 45%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryData.map((item, index) => (
            <Card key={item.category} className="shadow-card">
              <CardHeader>
                <CardDescription>{item.category}</CardDescription>
                <CardTitle className="text-2xl font-bold" style={{ color: COLORS[index] }}>
                  ${item.amount.toFixed(2)}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
