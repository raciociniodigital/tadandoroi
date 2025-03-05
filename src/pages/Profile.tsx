
import Layout from '@/components/Layout';
import ProfileForm from '@/components/profile/ProfileForm';

const Profile = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e senha
          </p>
        </div>
        
        <ProfileForm />
      </div>
    </Layout>
  );
};

export default Profile;
