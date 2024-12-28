import supabase from './lib/supabase';

const fetchUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  
  if (error) {
    console.error('Error fetching users:', error);
    return;
  }
  
  console.log('Users:', data);
};

fetchUsers();
