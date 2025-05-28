import { shallowRef } from 'vue'

// assets
import iconKontak from '@/assets/images/landing/tech-bootstrap.svg'
import iconFAQ from '@/assets/images/landing/tech-react.svg'
import iconTentang from '@/assets/images/landing/tech-angular.svg'
import iconKarir from '@/assets/images/landing/tech-node.svg'
import iconKebijakan from '@/assets/images/landing/tech-tailwind.svg'

const infoData = shallowRef([
  {
    image: iconKontak,
    title: 'Semen',
    target: '_self',
    name: 'Semen',
    description:
      'Silakan hubungi kami untuk pertanyaan lebih lanjut atau bantuan teknis melalui email, telepon, atau formulir kontak.',
    link: '/kontak',
    free: null
  },
  {
    image: iconFAQ,
    title: 'FAQ',
    target: '_self',
    name: 'Pertanyaan Umum',
    description:
      'Temukan jawaban atas pertanyaan umum mengenai penggunaan layanan, akun, dan fitur lainnya di halaman FAQ kami.',
    link: '/faq',
    free: null
  },
  {
    image: iconTentang,
    title: 'Tentang Kami',
    target: '_self',
    name: 'Profil Perusahaan',
    description:
      'Kami adalah tim yang berdedikasi dalam menciptakan solusi digital efisien dan andal untuk berbagai kebutuhan bisnis.',
    link: '/tentang',
    free: null
  },
  {
    image: iconKarir,
    title: 'Karir',
    target: '_self',
    name: 'Bergabung dengan Kami',
    description:
      'Bergabunglah dengan tim kami dan bantu kami membangun solusi teknologi masa depan. Lihat posisi terbuka di halaman karir.',
    link: '/karir',
    free: null
  },
  {
    image: iconKebijakan,
    title: 'Kebijakan Privasi',
    target: '_self',
    name: 'Privasi & Data',
    description:
      'Pelajari bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda di halaman Kebijakan Privasi.',
    link: '/kebijakan-privasi',
    free: null
  }
])

export default infoData
