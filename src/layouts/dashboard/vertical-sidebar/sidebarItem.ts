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
    id: 'components',
    title: 'Components',
    icon: 'custom-box-1',
    to: 'components/buttons',
    getURL: true,
    type: 'external',
    chip: 'new',
    chipColor: 'primary',
    chipVariant: 'tonal'
  },
  { header: 'Widget' },
  {
    id: 'statistics',
    title: 'Statistics',
    icon: 'custom-story',
    to: '/widget/statistics'
  },
  {
    id: 'data',
    title: 'Data',
    icon: 'custom-fatrows',
    to: '/widget/data'
  },
  {
    id: 'chart',
    title: 'Chart',
    icon: 'custom-presentation-chart',
    to: '/widget/chart'
  },
  { header: 'Applications' },
  {
    id: 'chat',
    title: 'Chat',
    icon: 'custom-chat',
    to: '/app/chats'
  },
  {
    id: 'calendar',
    title: 'Calendar',
    icon: 'custom-calendar-1',
    to: '/app/calendar'
  },
  {
    id: 'kanban',
    title: 'Kanban',
    icon: 'custom-kanban',
    to: '/app/kanban'
  },
  {
    title: 'Customer',
    icon: 'custom-users',
    to: '/customer/',
    children: [
      {
        id: 'customerlist',
        title: 'Customer List',
        to: '/customer/customerlist'
      },
      {
        id: 'createinvoice',
        title: 'Create Invoice',
        to: '/app/customer/create-invoice'
      },
      {
        id: 'orderdetails',
        title: 'Order Details',
        to: '/app/customer/order-details'
      },
      {
        id: 'orderlist',
        title: 'Order List',
        to: '/customer/orderlist'
      },
      {
        id: 'productlist',
        title: 'Product List',
        to: '/customer/productlist'
      },
      {
        id: 'productreview',
        title: 'Product Review',
        to: '/customer/productreview'
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
        title: 'Create',
        to: '/app/invoice/create'
      },
      {
        id: 'details',
        title: 'Details',
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
    title: 'Users',
    icon: 'custom-user-square',
    to: '/app/user',
    children: [
      {
        id: 'socialprofile',
        title: 'Social Profile',
        to: '/app/user/social/posts'
      },
      {
        id: 'accountprofile',
        title: 'Account Profile',
        to: '/app/user/account-profile',
        children: [
          {
            id: 'profile01',
            title: 'Profile 01',
            to: '/app/user/account-profile/profile1'
          },
          {
            id: 'profile02',
            title: 'Profile 02',
            to: '/app/user/account-profile/profile2'
          },
          {
            id: 'profile03',
            title: 'Profile 03',
            to: '/app/user/account-profile/profile3'
          }
        ]
      },
      {
        id: 'userprofile',
        title: 'User Profile',
        to: '/app/user/userprofile'
      },
      {
        id: 'cards',
        title: 'Cards',
        to: '/app/user/card',
        children: [
          {
            id: 'style01',
            title: 'Style 01',
            to: '/app/user/card/card1'
          },
          {
            id: 'style02',
            title: 'Style 02',
            to: '/app/user/card/card2'
          },
          {
            id: 'style03',
            title: 'Style 03',
            to: '/app/user/card/card3'
          }
        ]
      },
      {
        title: 'List',
        to: '/app/user/list',
        children: [
          {
            id: 'liststyle01',
            title: 'Style 01',
            to: '/app/user/list1'
          },
          {
            id: 'liststyle02',
            title: 'Style 02',
            to: '/app/user/list2'
          }
        ]
      }
    ]
  },
  {
    id: 'mail',
    title: 'Mail',
    icon: 'custom-direct-inbox',
    to: '/app/mail'
  },
  {
    title: 'Contact',
    icon: 'custom-user-circle-add',
    to: '/app/contacts',
    children: [
      {
        id: 'contactcard',
        title: 'Card',
        to: '/app/contact/c-card'
      },
      {
        id: 'contactlist',
        title: 'List',
        to: '/app/contact/c-list'
      }
    ]
  },
  {
    title: 'E-Commerce',
    icon: 'custom-shopping-bag',
    to: '/ecommerce/',
    children: [
      {
        id: 'products',
        title: 'Products',
        to: '/ecommerce/products'
      },
      {
        id: 'productdetail',
        title: 'Product Detail',
        to: '/ecommerce/product/detail/1'
      },
      {
        id: 'productlist',
        title: 'Product List',
        to: '/ecommerce/productlist'
      },
      {
        id: 'addproduct',
        title: 'Add New Product',
        to: '/ecommerce/add-product'
      },
      {
        id: 'checkout',
        title: 'Checkout',
        to: '/ecommerce/checkout'
      }
    ]
  },
  { header: 'Forms & Tables' },
  {
    id: 'formvalidation',
    title: 'Form Validation',
    icon: 'custom-password-check',
    to: '/forms/formvalidation'
  },
  {
    title: 'Layouts',
    icon: 'custom-row-vertical',
    to: '/forms/layouts',
    children: [
      {
        id: 'layouts',
        title: 'Layouts',
        to: '/forms/layouts/layouts'
      },
      {
        id: 'multicolumns',
        title: 'Multi Columns',
        to: '/forms/layouts/multi-column-forms'
      },
      {
        id: 'actionbar',
        title: 'Action Bar',
        to: '/forms/layouts/action-bar'
      },
      {
        id: 'stickybar',
        title: 'Sticky Bar',
        to: '/forms/layouts/sticky-action-bar'
      }
    ]
  },
  {
    title: 'Plugins',
    icon: 'custom-cpu-charge',
    to: '/forms/radio',
    children: [
      {
        id: 'mask',
        title: 'Mask',
        to: '/forms/plugins/mask'
      },
      {
        id: 'clipboard',
        title: 'Clipboard',
        to: '/forms/plugins/clipboard'
      },
      {
        id: 'recaptcha',
        title: 'reCaptcha',
        to: '/captcha'
      },
      {
        id: 'dropzone',
        title: 'Dropzone',
        to: '/forms/plugins/dropzone',
        chip: 'new',
        chipColor: 'primary',
        chipVariant: 'tonal'
      },
      {
        id: 'editor',
        title: 'Editor',
        to: '/forms/plugins/editor'
      }
    ]
  },
  {
    title: 'Tables',
    icon: 'custom-table',
    to: '/forms/tables',
    children: [
      {
        id: 'basictable',
        title: 'Basic Table',
        to: '/tables/tbl-basic'
      },
      {
        id: 'darktable',
        title: 'Dark Table',
        to: '/tables/tbl-dark'
      },
      {
        id: 'densitytable',
        title: 'Density Table',
        to: '/tables/tbl-density'
      },
      {
        id: 'heighttable',
        title: 'Height Table',
        to: '/tables/tbl-height'
      },
      {
        id: 'fixedheadertable',
        title: 'Fixed Header Table',
        to: '/tables/tbl-fixed-header'
      }
    ]
  },
  { header: 'Charts & map' },
  {
    title: 'Charts',
    icon: 'custom-graph',
    to: '/forms/radio',
    children: [
      {
        id: 'apexcharts',
        title: 'Apex Charts',
        to: '/forms/charts/apexchart'
      },
      {
        id: 'orgcharts',
        title: 'Org Charts',
        to: '/forms/charts/orgchart'
      }
    ]
  },
  { header: 'Utilities' },
  {
    title: 'Icons',
    icon: 'custom-mouse-circle',
    to: '/forms/radio',
    children: [
      {
        id: 'iconsax',
        title: 'Iconsax',
        type: 'external',
        to: 'https://iconsax.io/'
      },
      {
        id: 'tablericon',
        title: 'Tabler Icons',
        to: '/icons/tabler'
      },
      {
        id: 'materialicon',
        title: 'Material Icons',
        to: '/icons/material'
      }
    ]
  },
  { header: 'Pages' },
  {
    title: 'Authentication',
    icon: 'custom-shield',
    to: '/auth',
    children: [
      {
        title: 'Authentication 1',
        to: '/auth',
        children: [
          {
            id: 'login1',
            title: 'Login',
            to: '/login1'
          },
          {
            id: 'register1',
            title: 'Register',
            to: '/register1'
          },
          {
            id: 'forgotpassword1',
            title: 'Forgot Password',
            to: '/forgot-pwd1'
          },
          {
            id: 'checkmail1',
            title: 'Check Mail',
            to: '/check-mail1'
          },
          {
            id: 'resetpassword1',
            title: 'Reset Password',
            to: '/reset-pwd1'
          },
          {
            id: 'codeverification1',
            title: 'Code Verification',
            to: '/code-verify1'
          }
        ]
      },
      {
        title: 'Authentication 2',
        to: '/auth',
        children: [
          {
            id: 'login2',
            title: 'Login',
            to: '/login2'
          },
          {
            id: 'register2',
            title: 'Register',
            to: '/register2'
          },
          {
            id: 'forgotpassword2',
            title: 'Forgot Password',
            to: '/forgot-pwd2'
          },
          {
            id: 'checkmail2',
            title: 'Check Mail',
            to: '/check-mail2'
          },
          {
            id: 'resetpassword2',
            title: 'Reset Password',
            to: '/reset-pwd2'
          },
          {
            id: 'codeverification2',
            title: 'Code Verification',
            to: '/code-verify2'
          }
        ]
      },
      {
        id: 'authentication3',
        title: 'Authentication 3',
        to: '/login3'
      }
    ]
  },
  {
    title: 'Maintenance',
    icon: 'custom-maintenance',
    to: '/maintenenace',
    children: [
      {
        id: 'error404',
        title: 'Error 404',
        to: '/error'
      },
      {
        id: 'error500',
        title: 'Error 500',
        to: '/error500'
      },
      {
        title: 'Coming soon',
        to: '/maintenenace',
        children: [
          {
            id: 'cominingsoon1',
            title: 'Coming soon 1',
            to: '/comingsoon1'
          },
          {
            id: 'cominingsoon2',
            title: 'Coming soon 2',
            to: '/comingsoon2'
          }
        ]
      },
      {
        title: 'Under Construction',
        to: '/maintenenace',
        children: [
          {
            id: 'construction1',
            title: 'Under Construction 1',
            to: '/construction1'
          },
          {
            id: 'construction2',
            title: 'Under Construction 2',
            to: '/construction2'
          }
        ]
      }
    ]
  },
  {
    title: 'Price',
    icon: 'custom-dollar-square',
    to: '/pages/pricing1',
    children: [
      {
        id: 'price1',
        title: 'Price 1',
        to: '/pages/pricing1'
      },
      {
        id: 'price2',
        title: 'Price 2',
        to: '/pages/pricing2'
      }
    ]
  },
  {
    id: 'landing',
    title: 'Landing page',
    icon: 'custom-airplane',
    getURL: true,
    to: '',
    type: 'external'
  },
  {
    id: 'contact',
    title: 'Contact Us',
    icon: 'custom-support',
    getURL: true,
    to: 'contact-us',
    type: 'external'
  },
  {
    id: 'faq',
    title: 'FAQs',
    icon: 'custom-flag',
    getURL: true,
    to: 'faq',
    type: 'external'
  },
  {
    id: 'privacypolicy',
    title: 'Privacy Policy',
    icon: 'custom-shield-tick',
    getURL: true,
    to: 'privacy-policy',
    type: 'external'
  },
  { header: 'Others' },
  {
    id: 'sample',
    title: 'Sample Page',
    icon: 'custom-sample',
    to: '/starter'
  },
  {
    title: 'Menu levels',
    icon: 'custom-level-1',
    to: '#',
    children: [
      {
        id: 'level1',
        title: 'Level 1',
        disabled: true,
        to: '/level1'
      },
      {
        title: 'Level 1',
        to: '',
        children: [
          {
            id: 'level2',
            title: 'Level 2',
            disabled: true,
            to: '/level2'
          },
          {
            title: 'Level 2',
            to: '/2.2level',
            children: [
              {
                id: 'level3',
                title: 'Level 3',
                disabled: true,
                to: '/level3'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'subcaption',
    title: 'Sub Caption Levels',
    icon: 'custom-level',
    subCaption: 'Caption Collapse',
    to: ''
  },
  {
    id: 'disabledmenu',
    title: 'Disabled Menu',
    icon: 'custom-disabled',
    disabled: true,
    to: '/disabled'
  },
  {
    id: 'documentation',
    title: 'Documentation',
    icon: 'custom-support',
    to: 'https://phoenixcoded.gitbook.io/able-pro',
    type: 'external',
    chip: 'gitbook',
    chipColor: 'info',
    chipVariant: 'flat'
  },
  {
    id: 'roadmap',
    title: 'Road Map',
    icon: 'custom-roadmap',
    to: 'https://phoenixcoded.gitbook.io/able-pro/v/vue/roadmap',
    type: 'external'
  }
];

export default sidebarItem;
