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
    to: '/user/dashboard'
  },
  {
    title: 'Pengaturan',
    icon: 'custom-users',
    to: '/pengaturan/',
    children: [
      {
        id: 'profil',
        title: 'Profil',
        to: '/app/akun/profil'
      },
      {
        id: 'security',
        title: 'Ganti Password',
        to: '/app/akun/security'
      },
      {
        id: 'bank',
        title: 'bank',
        to: '/app/bank'
      }
    ]
  },
  {
    title: 'Transaksi',
    icon: 'custom-invoice',
    to: '/',
    children: [
      {
        id: 'Detail Transaksi',
        title: 'Dashboard',
        to: '/app/user/transaksi'
      },
      {
        id: 'checkout',
        title: 'Checkout',
        to: '/ecommerce/checkout'
      },
      {
        id: 'orderlist',
        title: 'Transaksi Saya',
        to: '/app/transaksi/user'
      },
    ]
  }
// end sidebar admin
];

export default sidebarItem;