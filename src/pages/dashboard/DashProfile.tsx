import{useState}from'react';import{useAuth}from'../../lib/auth';import{supabase}from'../../lib/supabase';import{useToast}from'../../lib/toast';
export function DashProfile(){
  const{user,profile,refresh}=useAuth();const{toast}=useToast();
  const[f,setF]=useState({full_name:profile?.full_name??'',phone:profile?.phone??''});
  const save=async(e:React.FormEvent)=>{e.preventDefault();if(!user)return;const{error}=await supabase.from('profiles').update({full_name:f.full_name||null,phone:f.phone||null}).eq('id',user.id);if(error){toast(error.message,'error');return}toast('Profile updated');await refresh()};
  return<div><h1 className="font-display text-2xl font-bold">Profile</h1>
    <form onSubmit={save} className="surface mt-5 max-w-xl space-y-4 p-6">
      <div><label className="label">Email</label><input value={user?.email??''} disabled className="input opacity-60"/></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><label className="label">Full name</label><input value={f.full_name} onChange={e=>setF({...f,full_name:e.target.value})} className="input"/></div>
        <div><label className="label">Phone</label><input value={f.phone} onChange={e=>setF({...f,phone:e.target.value})} className="input"/></div>
      </div>
      <button type="submit" className="btn-primary">Save changes</button>
    </form>
  </div>;
}
