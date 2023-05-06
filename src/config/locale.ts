import type { ILocale } from "@/types";
export default {
  id: "zh_CN",
  messages: {
    dateTypeDict: {
      M: {
        text: "月",
        value: "month",
      },
      w: {
        text: "周",
        value: "week",
      },
      d: {
        text: "天",
        value: "day",
      },
      h: {
        text: "小时",
        value: "hour",
      },
      m: {
        text: "分钟",
        value: "minute",
      },
      s: {
        text: "秒",
        value: "second",
      },
      y: {
        text: "年",
        value: "year",
      },
    },
    // file application status in `findDetail.tsx`
    fileApplyStatus: {
      0: "状态不明",
      1: "申请中",
      2: "已通过",
      3: "已拒绝",
      4: "审核中",
      5: "已过期",
    },
  },
  fields: {
    fileApplyStatus: [
      {
        value: 0,
        label: "状态不明",
      },
      {
        value: 1,
        label: "申请中",
      },
      {
        value: 2,
        label: "已通过",
      },
      {
        value: 3,
        label: "已拒绝",
      },
      {
        value: 4,
        label: "审核中",
      },
      {
        value: 4,
        label: "已过期",
      },
    ],
    // Whether to sort by upload time in reverse order
    descOrder: [
      {
        value: true,
        label: "最新上传 ↓",
      },
      {
        value: false,
        label: "最新上传 ↑",
      }
    ],
    FileType: [
      {
        value: "",
        label: "不限",
      },
      {
        value: 0,
        label: "文本" // 包括 文本文件 电子书文件 压缩文件
      },
      {
        value: 1,
        label: "数据"
      },
      {
        value: 2,
        label: "视频"
      },
      {
        value: 3,
        label: "音频"
      },
      {
        value: 4,
        label: "图像"
      },
      {
        value: 5,
        label: "可执行文件"
      },
      {
        value: 6,
        label: "其他"
      },
    ],
    fileCategory: [
      {
        value: "",
        label: "不限",
      },
      {
        value: 0,
        label: "哲学",
      },
      {
        value: 1,
        label: "宗教",
      },
      {
        value: 2,
        label: "伦理",
      },
      {
        value: 3,
        label: "逻辑",
      },
      {
        value: 4,
        label: "美学",
      },
      {
        value: 5,
        label: "心理",
      },
      {
        value: 6,
        label: "语言",
      },
      {
        value: 7,
        label: "文学",
      },
      {
        value: 8,
        label: "艺术",
      },
      {
        value: 9,
        label: "政治",
      },
      {
        value: 10,
        label: "经济",
      },
      {
        value: 11,
        label: "军事",
      },
      {
        value: 12,
        label: "法律",
      },
      {
        value: 13,
        label: "教育",
      },
      {
        value: 14,
        label: "体育",
      },
      {
        value: 15,
        label: "传媒",
      },
      {
        value: 16,
        label: "资讯",
      },
      {
        value: 17,
        label: "管理",
      },
      {
        value: 18,
        label: "商贸",
      },
      {
        value: 19,
        label: "历史",
      },
      {
        value: 20,
        label: "考古",
      },
      {
        value: 21,
        label: "民族",
      },
      {
        value: 22,
        label: "生活",
      },
      {
        value: 23,
        label: "财经",
      },
      {
        value: 24,
        label: "统计",
      },
      {
        value: 25,
        label: "社会",
      },
      {
        value: 26,
        label: "音乐",
      },
      {
        value: 27,
        label: "科技",
      },
      {
        value: 28,
        label: "宠物",
      },
    ],
    /**
     * in MyApprove.tsx
     */
    approveSelector: [
      {
        value: 1,
        label: "通过"
      },
      {
        value: 2,
        label: "驳回"
      }
    ]
  },
} as ILocale;
