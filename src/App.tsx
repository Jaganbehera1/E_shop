import{BrowserRouter,Routes,Route,Navigate}from'react-router-dom';
import{HelmetProvider}from'react-helmet-async';
import{AuthProvider,useAuth}from'./lib/auth';
import{ThemeProvider}from'./lib/theme';
import{CartProvider}from'./lib/cart';
import{WishlistProvider}from'./lib/wishlist';
import{ToastProvider}from'./lib/toast';
import{Header}from'./components/Header';
import{Footer,WAFab}from'./components/Footer';
import{HomePage}from'./pages/HomePage';
import{ProductsPage}from'./pages/ProductsPage';
import{ProductDetailPage}from'./pages/ProductDetailPage';
import{CartPage}from'./pages/CartPage';
import{CheckoutPage}from'./pages/CheckoutPage';
import{OrderConfirmedPage}from'./pages/OrderConfirmedPage';
import{OrderDetailPage}from'./pages/OrderDetailPage';
import{WishlistPage}from'./pages/WishlistPage';
import{ProjectsPage}from'./pages/ProjectsPage';
import{ServicesPage}from'./pages/ServicesPage';
import{ContactPage}from'./pages/ContactPage';
import{BlogListPage}from'./pages/BlogListPage';
import{BlogDetailPage}from'./pages/BlogDetailPage';
import{AuthPage}from'./pages/AuthPage';
import{AdminLoginPage}from'./pages/AdminLoginPage';
import{DashLayout}from'./pages/dashboard/DashLayout';
import{DashHome}from'./pages/dashboard/DashHome';
import{DashOrders}from'./pages/dashboard/DashOrders';
import{DashAddresses}from'./pages/dashboard/DashAddresses';
import{DashWishlist}from'./pages/dashboard/DashWishlist';
import{DashProjects}from'./pages/dashboard/DashProjects';
import{DashSupport}from'./pages/dashboard/DashSupport';
import{DashProfile}from'./pages/dashboard/DashProfile';
import{AdminLayout}from'./pages/admin/AdminLayout';
import{AdminDash}from'./pages/admin/AdminDash';
import{AdminProducts}from'./pages/admin/AdminProducts';
import{AdminOrders}from'./pages/admin/AdminOrders';
import{AdminCategories}from'./pages/admin/AdminCategories';
import{AdminProjects}from'./pages/admin/AdminProjects';
import{AdminBlogs}from'./pages/admin/AdminBlogs';
import{AdminCoupons}from'./pages/admin/AdminCoupons';
import{AdminCustomers}from'./pages/admin/AdminCustomers';
import{AdminBanners}from'./pages/admin/AdminBanners';
import{AdminAppointments}from'./pages/admin/AdminAppointments';
import{NotFound}from'./pages/NotFound';

/* Customer-facing shell with header/footer */
function StoreFront(){
  return(
    <div className="flex min-h-screen flex-col">
      <Header/>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/products" element={<ProductsPage/>}/>
          <Route path="/products/:slug" element={<ProductDetailPage/>}/>
          <Route path="/cart" element={<CartPage/>}/>
          <Route path="/checkout" element={<CheckoutPage/>}/>
          <Route path="/order-confirmed/:num" element={<OrderConfirmedPage/>}/>
          <Route path="/order/:num" element={<OrderDetailPage/>}/>
          <Route path="/wishlist" element={<WishlistPage/>}/>
          <Route path="/project-solutions" element={<ProjectsPage/>}/>
          <Route path="/services" element={<ServicesPage/>}/>
          <Route path="/contact" element={<ContactPage/>}/>
          <Route path="/blog" element={<BlogListPage/>}/>
          <Route path="/blog/:slug" element={<BlogDetailPage/>}/>
          <Route path="/auth" element={<AuthPage/>}/>
          <Route path="/dashboard" element={<RequireAuth><DashLayout/></RequireAuth>}>
            <Route index element={<DashHome/>}/>
            <Route path="orders" element={<DashOrders/>}/>
            <Route path="addresses" element={<DashAddresses/>}/>
            <Route path="wishlist" element={<DashWishlist/>}/>
            <Route path="projects" element={<DashProjects/>}/>
            <Route path="support" element={<DashSupport/>}/>
            <Route path="profile" element={<DashProfile/>}/>
          </Route>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </main>
      <Footer/><WAFab/>
    </div>
  );
}

/* Admin shell — no customer header/footer */
function AdminShell(){
  return(
    <Routes>
      <Route path="/admin-login" element={<AdminLoginPage/>}/>
      <Route path="/admin" element={<RequireAdmin><AdminLayout/></RequireAdmin>}>
        <Route index element={<AdminDash/>}/>
        <Route path="products" element={<AdminProducts/>}/>
        <Route path="orders" element={<AdminOrders/>}/>
        <Route path="categories" element={<AdminCategories/>}/>
        <Route path="projects" element={<AdminProjects/>}/>
        <Route path="appointments" element={<AdminAppointments/>}/>
        <Route path="blogs" element={<AdminBlogs/>}/>
        <Route path="coupons" element={<AdminCoupons/>}/>
        <Route path="customers" element={<AdminCustomers/>}/>
        <Route path="banners" element={<AdminBanners/>}/>
      </Route>
      {/* Fall through all other paths to the storefront */}
      <Route path="*" element={<StoreFront/>}/>
    </Routes>
  );
}

function RequireAuth({children}:{children:React.ReactNode}){
  const{user,loading}=useAuth();
  if(loading)return<div className="cx py-20 text-center text-[var(--muted)]">Loading…</div>;
  if(!user)return<Navigate to="/auth?next=/dashboard" replace/>;
  return<>{children}</>;
}

function RequireAdmin({children}:{children:React.ReactNode}){
  const{user,isAdmin,loading}=useAuth();
  if(loading)return<div className="cx py-20 text-center text-[var(--muted)]">Loading…</div>;
  if(!user||!isAdmin)return<Navigate to="/admin-login" replace/>;
  return<>{children}</>;
}

export default function App(){
  return(
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <WishlistProvider>
              <CartProvider>
                <BrowserRouter>
                  <AdminShell/>
                </BrowserRouter>
              </CartProvider>
            </WishlistProvider>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
