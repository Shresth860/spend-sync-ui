import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';
import api from '@/services/api';
import { toast } from 'sonner';

const Analytics = () => {
  const { user } = useAuth();
  const [categoryData, setCategoryData] = useState<Array<{ category: string; amount: number }>>([]);
  const [monthlyData, setMonthlyData] = useState<Array<{ month: string; expenses: number }>>([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['hsl(200, 95%, 45%)', 'hsl(165, 80%, 50%)', 'hsl(220, 15%, 45%)', 'hsl(0, 84%, 60%)', 'hsl(280, 70%, 50%)', 'hsl(45, 90%, 55%)'];

  useEffect(() => {
    if (user?.id) {
      fetchAnalytics();
    }
  }, [user?.id]);

  const fetchAnalytics = async () => {
    try {
      // Fetch category summary
      const categoryResponse = await api.get(`/expenses/CategorySummary/userId/${user?.id}`);
      const categoryMap = categoryResponse.data;
      
      if (categoryMap && typeof categoryMap === 'object' && Object.keys(categoryMap).length > 0) {
        const categoryArray = Object.entries(categoryMap).map(([category, amount]) => ({
          category,
          amount: amount as number,
        }));
        setCategoryData(categoryArray);
      }

      // Fetch monthly report
      const monthlyResponse = await api.get(`/expenses/MonthlyReport/userId/${user?.id}`);
      const monthlyMap = monthlyResponse.data;
      
      if (monthlyMap && typeof monthlyMap === 'object' && Object.keys(monthlyMap).length > 0) {
        const monthlyArray = Object.entries(monthlyMap).map(([month, expenses]) => ({
          month,
          expenses: expenses as number,
        }));
        setMonthlyData(monthlyArray);
      }
    } catch (error: any) {
      const errorMsg = error?.response?.data?.message || 'Failed to load analytics data';
      toast.error(errorMsg);
      console.error('Error fetching analytics:', error?.response || error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Analytics 📊</h1>
          <p className="text-muted-foreground mt-2">Visualize your spending patterns</p>
        </div>

        {categoryData.length === 0 && monthlyData.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                No analytics data available yet. Start adding expenses to see your spending patterns!
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {categoryData.length > 0 && (
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
              )}

              {monthlyData.length > 0 && (
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
              )}
            </div>

            {categoryData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoryData.map((item, index) => (
                  <Card key={item.category} className="shadow-card">
                    <CardHeader>
                      <CardDescription>{item.category}</CardDescription>
                      <CardTitle className="text-2xl font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                        ${item.amount.toFixed(2)}
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
