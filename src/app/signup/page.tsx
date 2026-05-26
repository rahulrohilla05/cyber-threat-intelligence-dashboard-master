import { SignupForm } from '@/components/auth/signup-form';
import { Header } from '@/components/layout/header';
import { APP_NAME } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">Join {APP_NAME}</CardTitle>
            <CardDescription>Create your account to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </p>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              <Link href="/" className="font-medium text-primary hover:underline">
                Back to Home
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
