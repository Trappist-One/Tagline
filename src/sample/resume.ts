import type { Resume } from '../types/resume'
import { uid } from '../utils'

/** 内置示例简历：新用户一键填入，快速体验完整编辑流程 */
export function createSampleResume(): Resume {
  const now = Date.now()
  return {
    id: uid('r_'),
    name: '示例简历',
    updatedAt: now,
    settings: { template: 'accent', accentColor: '#1a73e8' },
    content: {
      basics: {
        name: '张明',
        phone: '138-0000-0000',
        email: 'zhangming@example.com',
        city: '上海',
        intention: {
          position: '前端开发工程师',
          salary: '15-20K',
          type: '全职',
        },
      },
      sections: [
        {
          id: uid('s_'),
          type: 'work',
          hidden: false,
          items: [
            {
              id: uid('i_'),
              company: '某某科技有限公司',
              position: '高级前端工程师',
              start: '2021.06',
              end: '至今',
              desc:
                '负责核心业务系统（日均 PV 300万+）的前端开发与性能优化，主导首屏加载时间从 3.2s 降至 1.1s；\n搭建团队组件库与工程化规范，覆盖 5 条业务线，需求交付效率提升约 40%。',
            },
            {
              id: uid('i_'),
              company: '某某网络技术有限公司',
              position: '前端开发工程师',
              start: '2018.07',
              end: '2021.05',
              desc:
                '参与电商平台前端重构，完成购物车、订单等核心链路迁移；\n主导营销活动页搭建系统建设，运营自助配置率提升至 90%。',
            },
          ],
        },
        {
          id: uid('s_'),
          type: 'project',
          hidden: false,
          items: [
            {
              id: uid('i_'),
              name: '数据可视化中台',
              role: '前端负责人',
              start: '2022.03',
              end: '2023.01',
              desc:
                '从 0 到 1 搭建拖拽式报表搭建平台，支持 30+ 图表组件与数据源接入；\n服务公司内部 20+ 团队，累计创建报表 1200+ 张。',
            },
          ],
        },
        {
          id: uid('s_'),
          type: 'education',
          hidden: false,
          items: [
            {
              id: uid('i_'),
              school: '某某大学',
              major: '计算机科学与技术',
              degree: '本科',
              start: '2014.09',
              end: '2018.06',
            },
          ],
        },
        {
          id: uid('s_'),
          type: 'skill',
          hidden: false,
          items: [
            { id: uid('i_'), name: 'JavaScript / TypeScript', level: '精通' },
            { id: uid('i_'), name: 'Vue / React', level: '熟练' },
            { id: uid('i_'), name: 'Node.js', level: '熟练' },
            { id: uid('i_'), name: 'SQL / 数据库基础', level: '了解' },
          ],
        },
      ],
    },
  }
}

/** 空白简历：仅含默认区块结构 */
export function createEmptyResume(name = '我的简历'): Resume {
  const now = Date.now()
  return {
    id: uid('r_'),
    name,
    updatedAt: now,
    settings: { template: 'classic', accentColor: '#1a73e8' },
    content: {
      basics: {
        name: '',
        phone: '',
        email: '',
        city: '',
        intention: { position: '', salary: '', type: '全职' },
      },
      sections: [
        { id: uid('s_'), type: 'work', hidden: false, items: [] },
        { id: uid('s_'), type: 'project', hidden: false, items: [] },
        { id: uid('s_'), type: 'education', hidden: false, items: [] },
        { id: uid('s_'), type: 'skill', hidden: false, items: [] },
      ],
    },
  }
}
