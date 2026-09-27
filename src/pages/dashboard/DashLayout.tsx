import{NavLink,Outlet}from'react-router-dom';
import{LayoutDashboard,Package,MapPin,Heart,FolderKanban,LifeBuoy,User}from'lucide-react';
import{Seo}from'../../lib/seo';
const NAV=[{to:'/dashboard',l:'Overview',I:LayoutDashboard,end:true},{to:'/dashboard/orders',l:'Orders',I:Package},{to:'/dashboard/addresses',l:'Addresses',I:MapPin},{to:'/dashboard/wishlist',l:'Wishlist',I:Heart},{to:'/dashboard/projects',l:'Projects',I:FolderKanban},{to:'/dashboard/support',l:'Support',I:LifeBuoy},{to:'/dashboard/profile',l:'Profile',I:User}];
export function DashLayout(){return<div className="cx py-8"><Seo title="Dashboard"/>
  <div className="grid gap-6 md:grid-cols-[220px_1fr]">
    <aside><div className="surface p-2"><nav className="flex flex-col gap-1">{NAV.map(n=><NavLink key={n.to} to={n.to} end={n.end} className={({isActive})=>`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive?'bg-brand-600 text-white':'text-[var(--soft)] hover:bg-[var(--surface2)] hover:text-brand-600'}`}><n.I className="h-4 w-4"/> {n.l}</NavLink>)}</nav></div></aside>
    <Outlet/>
  </div>
</div>}
