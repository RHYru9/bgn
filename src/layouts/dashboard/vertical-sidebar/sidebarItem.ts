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
    to: '/dashboard/default',
    children: [
      {
        id: 'default',
        title: 'Default',
        to: '/dashboard/default'
      },
      {
        id: 'analytics',
        title: 'Analytics',
        to: '/dashboard/analytics'
      }
    ]
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
        id: 'createinvoice',
        title: 'Buat Invoice',
        to: '/app/customer/create-invoice'
      },
      {
        id: 'orderdetails',
        title: 'Detail Order',
        to: '/app/customer/order-details'
      },
      {
        id: 'orderlist',
        title: 'List Transaksi',
        to: '/customer/orderlist'
      }
    ]
  },
  {
    title: 'Invoice',
    icon: 'custom-invoice',
    to: '/',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        to: '/app/invoice/dashboard'
      },
      {
        id: 'create',
        title: 'Buat',
        to: '/app/invoice/create'
      },
      {
        id: 'details',
        title: 'Detail',
        to: '/app/invoice/details'
      },
      {
        id: 'list',
        title: 'List',
        to: '/app/invoice/list'
      },
      {
        id: 'edit',
        title: 'Edit',
        to: '/app/invoice/edit'
      }
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
        id: 'checkout',
        title: 'Checkout',
        to: '/ecommerce/checkout'
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
];

export default sidebarItem;