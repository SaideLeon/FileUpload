'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Bot, FileText, Lightbulb } from 'lucide-react';
import { generateProjectSummary, type GenerateProjectSummaryInput, type GenerateProjectSummaryOutput } from '@/ai/flows/generate-project-summary';
import type { Project, ProjectFile } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

interface ProjectSummaryProps {
  project: Project;
  files: ProjectFile[];
}

export function ProjectSummary({ project, files }: ProjectSummaryProps) {
  const [summary, setSummary] = useState<GenerateProjectSummaryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const fileCounts: Record<string, number> = {};
      const totalSizes: Record<string, number> = {};
      const uploadDates: string[] = [];

      files.forEach(file => {
        const ext = file.name.split('.').pop() || 'unknown';
        fileCounts[ext] = (fileCounts[ext] || 0) + 1;
        totalSizes[ext] = (totalSizes[ext] || 0) + file.size;
        uploadDates.push(file.uploadedAt);
      });
      
      const input: GenerateProjectSummaryInput = {
        projectName: project.name,
        fileCounts,
        totalSizes,
        uploadDates,
      };

      const result = await generateProjectSummary(input);
      setSummary(result);
    } catch (e) {
      setError('Failed to generate project summary. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1.5">
            <CardTitle>AI Project Insights</CardTitle>
            <CardDescription>Get a summary and actionable insights for your project.</CardDescription>
        </div>
        <Button onClick={handleGenerateSummary} disabled={isLoading}>
          <Bot className="mr-2 h-4 w-4" />
          {isLoading ? 'Generating...' : 'Generate Summary'}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="space-y-6 pt-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>
        )}
        {error && <p className="text-destructive text-sm pt-4">{error}</p>}
        {summary && (
          <div className="space-y-6 pt-4 text-sm">
            <div className="space-y-2">
              <h3 className="flex items-center font-semibold text-base">
                <FileText className="mr-2 h-5 w-5 text-primary" />
                Summary
              </h3>
              <p className="text-muted-foreground leading-relaxed">{summary.summary}</p>
            </div>
            <div className="space-y-2">
              <h3 className="flex items-center font-semibold text-base">
                <Lightbulb className="mr-2 h-5 w-5 text-accent" />
                Actionable Insights
              </h3>
              <p className="text-muted-foreground leading-relaxed">{summary.insights}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
