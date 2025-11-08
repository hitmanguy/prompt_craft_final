import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { ReportItemForm } from '@/components/report-item-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ReportItemPage() {
  const user = await getUser();

  if (!user) {
    redirect('/login?from=/report');
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8 animate-in fade-in duration-500">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Report an Item</CardTitle>
          <CardDescription>
            Fill out the form below to report a lost or found item. The more details you provide, the better.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportItemForm />
        </CardContent>
      </Card>
    </div>
  );
}
