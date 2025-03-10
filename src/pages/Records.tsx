
import Layout from '@/components/Layout';
import RecordsTable from '@/components/records/RecordsTable';

const Records = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <RecordsTable />
      </div>
    </Layout>
  );
};

export default Records;
