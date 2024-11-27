"use client";

import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function DocumentList() {
  const { data: documents } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await fetch('/api/documents');
      return response.json();
    },
  });

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">Recent Documents</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Processed At</TableHead>
              <TableHead>Invoice Amount</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents?.map((doc: any) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.fileName}</TableCell>
                <TableCell>{doc.fileType}</TableCell>
                <TableCell>{doc.status}</TableCell>
                <TableCell>
                  {format(new Date(doc.processedAt), 'MMM d, yyyy HH:mm')}
                </TableCell>
                <TableCell>
                  ${doc.invoiceAmount?.toFixed(2) ?? '0.00'}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Document Details</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2">Original Document</h3>
                          <img
                            src={doc.originalUrl}
                            alt={doc.fileName}
                            className="max-h-[600px] object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2">JSON Output</h3>
                          <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[600px]">
                            {JSON.stringify(JSON.parse(doc.jsonOutput), null, 2)}
                          </pre>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}