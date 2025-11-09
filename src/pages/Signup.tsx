import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

const SignupSchema = z.object({
  userName: z.string().trim().min(3, { message: 'Username must be at least 3 characters' }).max(30, { message: 'Username must be at most 30 characters' }),
  email: z.string().trim().email({ message: 'Enter a valid email address' }).max(255),
  mobileNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{7,15}$/, { message: 'Mobile number must be 7-15 digits' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }).max(100),
  monthlyLimit: z.number().int().positive().max(100000000).default(10000),
});

const Signup = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    mobileNumber: '',
    password: '',
    monthlyLimit: 10000,
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const result = SignupSchema.safeParse(formData);
    if (!result.success) {
      const first = result.error.errors[0];
      toast.error(first?.message || 'Please check your input and try again.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/signup', result.data);
      toast.success('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (error: any) {
      const serverMessage: string = error?.response?.data?.message || '';
      let friendly = serverMessage || 'Failed to create account. Please try again.';

      if (error?.response?.status === 500 && /Duplicate entry/i.test(serverMessage)) {
        // Likely a unique constraint violation on username or email
        friendly = 'User already exists. Try a different username or email.';
      }

      toast.error(friendly);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-auth p-4">
      <Card className="w-full max-w-md shadow-elevated animate-fade-in">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription>Sign up to start tracking your expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userName">Username</Label>
              <Input
                id="userName"
                name="userName"
                type="text"
                placeholder="johndoe"
                value={formData.userName}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={3}
                maxLength={30}
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                maxLength={255}
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number</Label>
              <Input
                id="mobileNumber"
                name="mobileNumber"
                type="tel"
                placeholder="9876543210"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                disabled={loading}
                inputMode="numeric"
                pattern="^[0-9]{7,15}$"
                maxLength={15}
                autoComplete="tel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                minLength={6}
                maxLength={100}
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
