import { Metadata } from 'next';
import { FileUpload } from '@/components/file-upload';
import { DashboardStats } from '@/components/dashboard-stats';
import { DocumentList } from '@/components/document-list';

export const metadata: Metadata = {
  title: 'OCR Document Processing',
  description: 'Upload and process documents with OCR',
};

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Document Processing Dashboard</h1>
      
      <div className="grid gap-6">
        <DashboardStats />
        <FileUpload />
        <DocumentList />
      </div>
    </div>
  );
}