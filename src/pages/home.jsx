import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Sparkles, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/auth-context";

export default function HomePage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      {/* Hero Banner Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-2xl border p-6 md:p-12 lg:p-16 mb-12 md:mb-16 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 mb-4 md:mb-6 bg-primary/10 rounded-full text-xs md:text-sm font-medium">
            <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-primary" />
            <span>Your Personal Finance Manager</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 md:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Take Control of Your Finances
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            Track your income and expenses, set budgets, and achieve your
            financial goals with our comprehensive financial management
            platform. Start your journey to financial freedom today.
          </p>
          {!user && (
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="gap-2 text-sm md:text-base sm:w-auto"
                >
                  Get Started Free
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Static Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12">
        {/* Budgeting Tips Section */}
        <Card className="hover:shadow-lg transition-shadow border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              <CardTitle className="text-lg md:text-xl">
                Budgeting Tips
              </CardTitle>
            </div>
            <CardDescription className="text-xs md:text-sm">
              Essential tips to help you manage your finances better
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-5">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm md:text-base flex items-center gap-2">
                <span className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0">
                  1
                </span>
                Track Every Expense
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground ml-7 md:ml-8">
                Record all your expenses, no matter how small. This helps you
                understand where your money is going.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm md:text-base flex items-center gap-2">
                <span className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0">
                  2
                </span>
                Set Realistic Goals
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground ml-7 md:ml-8">
                Create achievable financial goals. Start small and gradually
                increase your targets as you build better habits.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm md:text-base flex items-center gap-2">
                <span className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0">
                  3
                </span>
                Review Regularly
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground ml-7 md:ml-8">
                Check your financial reports weekly or monthly to stay on track
                and adjust your budget as needed.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm md:text-base flex items-center gap-2">
                <span className="h-5 w-5 md:h-6 md:w-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center flex-shrink-0">
                  4
                </span>
                Build an Emergency Fund
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground ml-7 md:ml-8">
                Aim to save at least 3-6 months of expenses in an emergency fund
                for unexpected situations.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Why Financial Planning Matters Section */}
        <Card className="hover:shadow-lg transition-shadow border-2">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 md:h-5 md:w-5 text-primary" />
              <CardTitle className="text-lg md:text-xl">
                Why Financial Planning Matters
              </CardTitle>
            </div>
            <CardDescription className="text-xs md:text-sm">
              Understanding the importance of managing your finances
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-5">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm md:text-base">
                Achieve Your Goals
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground">
                Financial planning helps you set and achieve both short-term and
                long-term goals, whether it's buying a home, saving for
                retirement, or planning a vacation.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm md:text-base">
                Reduce Stress
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground">
                Having a clear view of your finances reduces anxiety and gives
                you peace of mind about your financial future.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm md:text-base">
                Make Informed Decisions
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground">
                With proper tracking and analysis, you can make better financial
                decisions based on data rather than guesswork.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm md:text-base">
                Build Wealth
              </h4>
              <p className="text-xs md:text-sm text-muted-foreground">
                Consistent tracking and planning helps you identify
                opportunities to save more and build wealth over time.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
