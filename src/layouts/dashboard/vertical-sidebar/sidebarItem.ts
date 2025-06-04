export interface menu {
  id?: string;
  header?: string;
  title?: string;
  icon?: string;
  to?: string;
  divider?: boolean;
  getURL?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  type?: string;
  subCaption?: string;
}

const sidebarItem: menu[] = [
  { header: 'Dashboard' },
  {
    title: 'Dashboard',
    icon: 'custom-home-trend',
    to: '/dashboard/default'
  },
  {
    title: 'Pelanggan',
    icon: 'custom-users',
    to: '/customer/',
    children: [
      {
        id: 'customerlist',
        title: 'List Pelanggan',
        to: '/customer/customerlist'
      },
      {
        id: 'orderdetails',
        title: 'Detail Order',
        to: '/app/customer/order-details'
      }
    ]
  },
  {
    title: 'Transaksi',
    icon: 'custom-invoice',
    to: '/',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        to: '/app/transaksi/dashboard'
      },
      {
        id: 'create',
        title: 'Buat',
        to: '/app/transaksi/buat'
      },
      {
        id: 'orderlist',
        title: 'List Transaksi',
        to: '/app/transaksi/list'
      },
    ]
  },
  {
    title: 'Bagian Produk',
    icon: 'custom-shopping-bag',
    to: '/ecommerce/',
    children: [
      {
        id: 'productlist',
        title: 'List Produk',
        to: '/ecommerce/productlist'
      },
      {
        id: 'addproduct',
        title: 'Tambah Produk Baru',
        to: '/ecommerce/add-product'
      },
      {
        id: 'kategori-list',
        title: 'List Kategori',
        to: '/ecommerce/kategori/list'
      },
      {
        id: 'ulasan',
        title: 'Ulasan',
        to: '/ulasan/ulasan'
      }
    ]
  },
  {
    title: 'Supplier',
    icon: 'custom-users',
    to: '/ecommerce/supplier',
    children: [
      {
        id: 'supplier-list',
        title: 'Daftar Supplier',
        to: '/ecommerce/supplier'
      },
      {
        id: 'add-supplier',
        title: 'Tambah Supplier',
        to: '/ecommerce/supplier/add'
    }
    ]
  }
// end sidebar admin
];

export default sidebarItem;