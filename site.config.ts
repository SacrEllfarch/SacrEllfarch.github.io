import { defineSiteConfig } from 'valaxy'

const favicon = '/favicon.png?v=terchdox-20260427'

export default defineSiteConfig({
  url: 'https://sacrellfarch.github.io/',
  favicon,
  feed: {
    favicon,
  },
  lang: 'zh-CN',
  title: '我的博客',
  author: {
    name: 'SacrEllfarch',
    email: '2091538824thx@gmail.com',
    link: 'https://github.com/SacrEllfarch',
    avatar: '/avatar.jpg',
  },
  description: '记录学习与生活',
  social: [
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
      name: 'E-Mail',
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

  search: {
    enable: false,
  },

  sponsor: {
    enable: false,
  },
})
