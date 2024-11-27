"use client";

import { Card } from '@/components/ui/card';
import { FileText, FileCheck, DollarSign, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function DashboardStats() {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await fetch('/api/stats');
      return response.json();
    },
  });

  const { data: chartData } = useQuery({
    queryKey: ['chart-data'],
    queryFn: async () => {
      const response = await fetch('/api/chart-data');
      return response.json();
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Documents
            </p>
            <h3 className="text-2xl font-bold">{stats?.totalDocuments ?? 0}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <FileCheck className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Processed Today
            </p>
            <h3 className="text-2xl font-bold">{stats?.processedToday ?? 0}</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <DollarSign className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Invoice Amount
            </p>
            <h3 className="text-2xl font-bold">
              ${stats?.totalInvoiceAmount?.toFixed(2) ?? '0.00'}
            </h3>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <Clock className="h-8 w-8 text-primary" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Avg. Processing Time
            </p>
            <h3 className="text-2xl font-bold">{stats?.avgProcessingTime ?? '0'}s</h3>
          </div>
        </div>
      </Card>

      <Card className="p-6 md:col-span-2 lg:col-span-4">
        <h3 className="text-lg font-semibold mb-4">Processing Volume (Last 7 Days)</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="documents" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}