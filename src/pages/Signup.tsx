import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Sparkles, Target, BarChart3 } from 'lucide-react';
import { z } from 'zod';
import signupHero from '@/assets/signup-hero.jpg';

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
    <div className="min-h-screen flex">
      {/* Left Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-accent/10 via-primary/10 to-secondary/10">
        <img 
          src={signupHero} 
          alt="Financial Success" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-90"
        />
        <div className="relative z-10 flex flex-col justify-center p-12 text-foreground">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-5xl font-bold leading-tight">
              Start Your<br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">Financial Journey</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Join thousands of users who have taken control of their finances and achieved their savings goals.
            </p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm">Easy setup in under 2 minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Target className="w-5 h-5 text-accent" />
                </div>
                <span className="text-sm">Set and achieve budget goals</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <BarChart3 className="w-5 h-5 text-secondary-foreground" />
                </div>
                <span className="text-sm">Track spending with beautiful charts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background overflow-y-auto">
        <Card className="w-full max-w-md shadow-elevated animate-scale-in border-border/50 my-8">
          <CardHeader className="space-y-2 text-center pb-6">
            <CardTitle className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-base">Start tracking your expenses today</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName" className="text-sm font-medium">Username</Label>
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
                  className="h-11 transition-all focus:ring-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
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
                  className="h-11 transition-all focus:ring-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber" className="text-sm font-medium">Mobile Number</Label>
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
                  className="h-11 transition-all focus:ring-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
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
                  className="h-11 transition-all focus:ring-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyLimit" className="text-sm font-medium">Monthly Spending Limit</Label>
                <Input
                  id="monthlyLimit"
                  name="monthlyLimit"
                  type="number"
                  placeholder="10000"
                  value={formData.monthlyLimit}
                  onChange={(e) => setFormData({ ...formData, monthlyLimit: parseInt(e.target.value) || 0 })}
                  required
                  disabled={loading}
                  min={0}
                  className="h-11 transition-all focus:ring-2"
                />
              </div>
              <Button type="submit" className="w-full h-11 text-base font-medium" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-semibold transition-colors">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
