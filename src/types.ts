export interface Profile {
  id:string; email:string; full_name:string|null; phone:string|null;
  role:'customer'|'admin'; avatar_url:string|null; created_at:string;
}
export interface Category {
  id:string; name:string; slug:string; description:string|null;
  icon:string|null; parent_id:string|null; sort_order:number; is_active:boolean;
}
export interface Product {
  id:string; name:string; slug:string; sku:string; description:string|null;
  short_description:string|null; price:number; discount_price:number|null;
  stock_qty:number; images:string[]; specifications:Record<string,string>;
  category_id:string|null; is_featured:boolean; is_active:boolean;
  rating_avg:number; rating_count:number; created_at:string;
}
export interface CartLine {
  id:string; user_id:string|null; session_id:string|null;
  product_id:string; quantity:number; product:Product;
}
export interface Address {
  id:string; user_id:string; full_name:string; phone:string;
  line1:string; line2:string|null; city:string; state:string;
  pincode:string; is_default:boolean;
}
export type OrderStatus='pending'|'confirmed'|'shipped'|'out_for_delivery'|'delivered'|'cancelled'|'refunded';
export interface OrderItem {
  id:string; order_id:string; product_id:string|null; name:string;
  sku:string|null; image_url:string|null; price:number; quantity:number; total:number;
}
export interface Order {
  id:string; order_number:string; user_id:string; status:OrderStatus;
  payment_status:string; payment_method:string; payment_ref:string|null;
  subtotal:number; discount:number; shipping:number; total:number;
  coupon_code:string|null; shipping_address:Address; tracking_number:string|null;
  notes:string|null; placed_at:string; updated_at:string; order_items?:OrderItem[];
}
export interface Review {
  id:string; product_id:string; user_id:string; rating:number;
  title:string|null; body:string|null; approved:boolean; created_at:string;
  reviewer?:{full_name:string|null}|null;
}
export type ProjectType='school'|'science'|'engineering'|'final_year'|'iot'|'robotics'|'web'|'android'|'embedded'|'custom';
export interface ProjectRequest {
  id:string; user_id:string|null; name:string; email:string; phone:string;
  project_type:ProjectType; title:string; description:string;
  requirements_url:string|null; budget:number|null; estimated_cost:number|null;
  status:string; whatsapp_sent:boolean; created_at:string;
}
export interface Appointment {
  id:string; user_id:string|null; name:string; email:string; phone:string;
  topic:string; service_type:string|null; preferred_date:string;
  preferred_time:string; notes:string|null; status:string; created_at:string;
}
export interface Blog {
  id:string; title:string; slug:string; excerpt:string|null; content:string;
  cover_image:string|null; tags:string[]; category:string|null; author:string|null;
  published:boolean; published_at:string|null;
  meta_title:string|null; meta_description:string|null; created_at:string;
}
export interface Banner {
  id:string; title:string; image_url:string|null; link:string|null;
  position:string; sort_order:number; is_active:boolean;
}
export interface Coupon {
  id:string; code:string; description:string|null;
  discount_type:'percent'|'flat'; discount_value:number;
  min_order:number; max_uses:number|null; used_count:number; is_active:boolean;
}
export interface SupportTicket {
  id:string; user_id:string; subject:string; message:string;
  status:string; admin_reply:string|null; created_at:string;
}
