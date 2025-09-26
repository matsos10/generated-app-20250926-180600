import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api-client';
import { toast } from 'sonner';
import type { MeetingAnalysisResult } from '@shared/types';
import { Bot, CheckSquare, ClipboardList, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
export function MeetingAnalysisPage() {
  const [meetingText, setMeetingText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MeetingAnalysisResult | null>(null);
  const handleAnalyze = async () => {
    if (!meetingText.trim()) {
      toast.warning('Please enter some meeting notes to analyze.');
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await api<MeetingAnalysisResult>('/api/ai/analyze-meeting', {
        method: 'POST',
        body: JSON.stringify({ text: meetingText }),
      });
      setResult(analysisResult);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze meeting notes.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Meeting Analysis</h1>
          <p className="text-muted-foreground">
            Paste your meeting notes below and let our AI summarize, extract key decisions, and identify action items.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Notes</CardTitle>
                <CardDescription>Enter the raw text from your meeting.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Paste your meeting notes here..."
                  className="min-h-[300px] resize-y"
                  value={meetingText}
                  onChange={(e) => setMeetingText(e.target.value)}
                  disabled={isLoading}
                />
              </CardContent>
            </Card>
            <Button onClick={handleAnalyze} disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Analyze with AI
                </>
              )}
            </Button>
          </div>
          <div className="lg:col-span-3">
            <Card className="min-h-[480px]">
              <CardHeader>
                <CardTitle>Analysis Result</CardTitle>
                <CardDescription>Here's what our AI found in your notes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoading && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-1/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  </div>
                )}
                {!isLoading && !result && (
                  <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
                    <Bot className="h-12 w-12 mb-4" />
                    <p>Your analysis results will appear here.</p>
                  </div>
                )}
                {result && (
                  <>
                    <div>
                      <h3 className="font-semibold flex items-center mb-2">
                        <ClipboardList className="h-5 w-5 mr-2 text-primary" />
                        Summary
                      </h3>
                      <p className="text-sm text-muted-foreground">{result.summary}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center mb-2">
                        <CheckSquare className="h-5 w-5 mr-2 text-primary" />
                        Key Decisions
                      </h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {result.keyDecisions.map((decision, i) => (
                          <li key={i}>{decision}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold flex items-center mb-2">
                        <ClipboardList className="h-5 w-5 mr-2 text-primary" />
                        Action Items
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {result.actionItems.map((item) => (
                          <li key={item.id} className="p-2 bg-muted rounded-md">
                            <strong>{item.task}</strong> - Assigned to {item.assignee} (Due: {item.dueDate})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}