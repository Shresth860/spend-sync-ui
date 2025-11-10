import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LogOut, User, Mail, Loader2, Trash2 } from 'lucide-react';
import api from '@/services/api';
import { toast } from 'sonner';

const Settings = () => {
  const { user, logout } = useAuth();
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userName: user?.username || '',
    email: user?.email || '',
    mobileNumber: '',
    monthlyLimit: 10000,
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.put(`/User/updateUser/${user?.id}`, {
        userName: formData.userName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        monthlyLimit: formData.monthlyLimit,
      });
      
      toast.success('Profile updated successfully!');
      setUpdateDialogOpen(false);
    } catch (error: any) {
      toast.error('Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setSubmitting(true);

    try {
      await api.delete(`/User/deleteUser/${user?.id}`);
      toast.success('Account deleted successfully');
      logout();
    } catch (error: any) {
      toast.error('Failed to delete account');
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Settings ⚙️</h1>
          <p className="text-muted-foreground mt-2">Manage your account preferences</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={user?.username || 'User'}
                disabled
                className="bg-secondary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email || 'user@example.com'}
                disabled
                className="bg-secondary"
              />
            </div>
            <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
              <DialogTrigger asChild>
                <Button>Update Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Profile</DialogTitle>
                  <DialogDescription>Edit your account information</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="updateUsername">Username</Label>
                    <Input
                      id="updateUsername"
                      value={formData.userName}
                      onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="updateEmail">Email</Label>
                    <Input
                      id="updateEmail"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="updateMobile">Mobile Number</Label>
                    <Input
                      id="updateMobile"
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      placeholder="9876543210"
                      pattern="^[0-9]{7,15}$"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="updateMonthlyLimit">Monthly Spending Limit</Label>
                    <Input
                      id="updateMonthlyLimit"
                      type="number"
                      value={formData.monthlyLimit}
                      onChange={(e) => setFormData({ ...formData, monthlyLimit: parseInt(e.target.value) || 0 })}
                      min={0}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="shadow-card border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Actions that require attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              onClick={logout}
              className="gap-2 w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4" />
              Logout from Account
            </Button>
            
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2 w-full sm:w-auto">
                  <Trash2 className="w-4 h-4" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-4 justify-end">
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete Account'
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
