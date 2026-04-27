import { defineValaxyConfig } from 'valaxy'
import type { ThemeUserConfig } from 'valaxy-theme-sakura'

const safelist = [
  'i-ri-github-line',
  'i-ri-mail-line',
  'i-ri-rss-line',
  'i-mdi-rss',
  'i-ri-qq-line',
  'i-ri-steam-fill',
  'i-ri-home-5-line',
  'i-ri-archive-line',
  'i-ri-folder-2-line',
  'i-ri-price-tag-3-line',
  'i-ri-links-line',
  'i-ri-user-smile-line',
]

const mottoPool = [
  '白昼之光，岂知夜色之深.',
  '四叠半的狂想.',
  '万物皆虚，万事皆允.',
  '曾有一位女郎，她行遍许多世界.',
  '藏好自己，做好清理...',
  '我们的征途是星辰大海！',
  '今朝依旧，今后亦然.',
  '人类的赞歌就是勇气的赞歌.',
  '凡是过往，皆为序章.',
  '生如夏花之绚烂，死如秋叶之静美.',
  '凌晨四点，我看见海棠花未眠.',
  '山川异域，风月同天.',
  '浮生若梦，为欢几何.',
  '寄蜉蝣于天地，渺沧海之一粟.',
  '人生天地间，忽如远行客.',
  '长夜将至，我从今开始守望.',
  '我们生活在阴沟里，但仍有人仰望星空.',
  '风起于青萍之末，浪成于微澜之间.',
  '群星不会回答，但它们一直在那里.',
  '世界以痛吻我，要我报之以歌.',
  '我与旧事归于尽，来年依旧迎花开.',
  '生于尘埃，心向群星.',
  '愿心不困于一隅，愿梦不止于此身.',
  '我曾见群星坠入梦中.',
  '我野蛮生长，没能成为自己的月亮.',
  '循此苦旅，终抵群星.',
]

const randomMottos = Array.from(
  { length: 30 },
  () => mottoPool[Math.floor(Math.random() * mottoPool.length)],
)

const base = process.env.VALAXY_BASE || '/'
const mediaBase = 'https://blog.terchdox.top/blog-assets'

const heroConfig = {
  title: 'SacrEllfarch 的小站',
  motto: randomMottos as unknown as string,
  urls: [
    '/images/hero-virtuosa.jpg',
    '/images/hero-blue-orbit.jpg',
    `${mediaBase}/videos/elaina.mp4`,
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.jpg',
    '/images/5.png',
    '/images/6.jpg',
    '/images/7.jpg',
    '/images/8.jpg',
    '/images/9.png',
  ],
  playerUrl: `${mediaBase}/videos/see.mp4`,
  randomUrls: true,
  style: 'scanline',
  typewriter: true,
  socials: [
    {
      name: 'GitHub',
      link: 'https://github.com/SacrEllfarch',
      icon: 'i-ri-github-line',
      color: '#3a577a',
    },
    {
      name: 'QQ',
      link: 'https://wpa.qq.com/msgrd?v=3&uin=2091538824&site=qq&menu=yes',
      icon: 'i-ri-qq-line',
      color: '#7bda4f',
    },
    {
      name: 'Steam',
      link: 'https://steamcommunity.com/profiles/76561199137272001',
      icon: 'i-ri-steam-fill',
      color: '#57a6d4',
    },
    {
      name: 'Email',
      link: 'mailto:2091538824thx@gmail.com',
      icon: 'i-ri-mail-line',
      color: '#e09f6288',
    },
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: '#5978dd',
    },
  ],
  socialStyle: 'merge',
} satisfies ThemeUserConfig['hero']

export default defineValaxyConfig<ThemeUserConfig>({
  theme: 'sakura',

  siteConfig: {
    title: '我的博客',
    author: {
      name: 'SacrEllfarch',
    },
    description: '把身心交予自由\n任其漂流',
  },

  themeConfig: {
    ui: {
      primary: '#459ad3',
    },

    navbar: [
      {
        text: '首页',
        icon: 'i-ri-home-5-line',
        link: '/',
      },
      {
        text: '归档',
        icon: 'i-ri-archive-line',
        link: '/archives/',
      },
      {
        text: '分类',
        icon: 'i-ri-folder-2-line',
        link: '/categories/',
      },
      {
        text: '标签',
        icon: 'i-ri-price-tag-3-line',
        link: '/tags/',
      },
      {
        text: '友链',
        icon: 'i-ri-links-line',
        link: '/links/',
      },
      {
        text: '关于',
        icon: 'i-ri-user-smile-line',
        link: '/about/',
      },
    ],
    navbarOptions: {
      title: ['SacrEllfarch', 'Blog'],
      subTitle: '',
      showMarker: false,
      autoHide: ['home'],
      invert: ['home'],
    },

    // Sakura v0.10.2 still uses the legacy banner hook to merge custom hero config.
    banner: heroConfig,
    hero: heroConfig,
  },

  vite: {
    base,
  },

  unocss: {
    safelist,
  },
})
