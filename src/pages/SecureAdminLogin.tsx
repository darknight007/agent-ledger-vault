import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { Loader2, ShieldAlert } from "lucide-react";

const authSchema = z.object({
    email: z.string().trim().email("Invalid email address").max(255),
    password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

export default function SecureAdminLogin() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isValidToken, setIsValidToken] = useState(false);
    const [isCheckingToken, setIsCheckingToken] = useState(true);
    const { token } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        // Validate the access token from URL
        const expectedToken = import.meta.env.VITE_ADMIN_ACCESS_TOKEN;

        if (!expectedToken) {
            console.error("Admin access token not configured");
            setIsCheckingToken(false);
            return;
        }

        if (token === expectedToken) {
            setIsValidToken(true);
        } else {
            toast({
                title: "Access Denied",
                description: "Invalid access token. Please use the correct admin URL.",
                variant: "destructive",
            });
        }

        setIsCheckingToken(false);
    }, [token, toast]);

    useEffect(() => {
        // Check if user is already logged in
        if (isValidToken) {
            supabase.auth.getSession().then(({ data: { session } }) => {
                if (session) {
                    navigate("/admin");
                }
            });

            // Listen for auth changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                if (session && event === "SIGNED_IN") {
                    navigate("/admin");
                }
            });

            return () => subscription.unsubscribe();
        }
    }, [navigate, isValidToken]);

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const validated = authSchema.parse({ email, password });

            const { error, data } = await supabase.auth.signInWithPassword({
                email: validated.email.toLowerCase().trim(),
                password: validated.password,
            });

            if (error) {
                console.error("Supabase auth error:", error);
                throw error;
            }

            if (!data.session) {
                throw new Error("No session created after login");
            }

            toast({
                title: "Welcome back!",
                description: "You've been signed in successfully.",
            });
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                toast({
                    title: "Validation error",
                    description: error.errors[0].message,
                    variant: "destructive",
                });
            } else if (error instanceof Error) {
                console.error("Login error:", error);

                // Provide more helpful error messages
                let errorMessage = "Invalid email or password. Please check your credentials and try again.";
                if (error.message.includes("Failed to fetch")) {
                    errorMessage = "Network connection error. Please check your internet connection and try again.";
                } else if (error.message.includes("Invalid login")) {
                    errorMessage = "Invalid email or password.";
                } else if (error.message) {
                    errorMessage = error.message;
                }

                toast({
                    title: "Login failed",
                    description: errorMessage,
                    variant: "destructive",
                });
            } else {
                console.error("Login error:", error);
                toast({
                    title: "Login failed",
                    description: "An unexpected error occurred during login",
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isValidToken) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-center mb-4">
                            <ShieldAlert className="h-12 w-12 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl text-center">Access Denied</CardTitle>
                        <CardDescription className="text-center">
                            The admin access URL you used is invalid or has expired.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground text-center">
                            Please contact the system administrator for the correct access URL.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl gradient-text text-center">AskScrooge Admin</CardTitle>
                    <CardDescription className="text-center">
                        Sign in to access the admin dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="login-email">Email</Label>
                            <Input
                                id="login-email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="login-password">Password</Label>
                            <Input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
