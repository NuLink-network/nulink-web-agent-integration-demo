import type { ILocale } from "@/types";
export default {
  id: "en",
  messages: {
    dateTypeDict: {
      M: {
        text: "month",
        value: "month",
      },
      w: {
        text: "week",
        value: "week",
      },
      d: {
        text: "day",
        value: "day",
      },
      h: {
        text: "hour",
        value: "hour",
      },
      m: {
        text: "minute",
        value: "minute",
      },
      s: {
        text: "second",
        value: "second",
      },
      y: {
        text: "year",
        value: "year",
      },
    },
    // file application status in `findDetail.tsx`
    fileApplyStatus: {
      0: "Unknown",
      1: "Pending",
      2: "Approved",
      3: "Rejected",
      4: "Under review"
    },
    notificationType: {
      1: "Application",
      2: "Approved",
      3: "Rejected",
      4: "Approved Automatically",
      5: "Create Policy",
    },
    suffixs: {
      mp4: 'video',
      mp3: 'audio',
      word: 'word',
      pdf: 'pdf',
      json: 'word',
      excel: 'excel',
      xlsx: 'excel',
      xls: 'excel',
      docx: 'word',
      doc: 'word'
    }
  },
  fields: {
    fileApplyStatus: [
      {
        value: 0,
        label: "Unknown",
      },
      {
        value: 1,
        label: "Pending",
      },
      {
        value: 2,
        label: "Approved",
      },
      {
        value: 3,
        label: "Rejected",
      },
      {
        value: 4,
        label: "Under review",
      }
    ],
    // Whether to sort by upload time in reverse order in page `find.tsx`
    descOrder: [
      {
        value: true,
        label: "From newest to oldest",
      },
      {
        value: false,
        label: "Fromest old to newest",
      }
    ],
    fileType: [
      {
        value: "",
        label: "Unlimited",
      },
      {
        value: 0,
        label: "Text" // Include text files ebook files zip files
      },
      {
        value: 1,
        label: "Data" // Include data files
      },
      {
        value: 2,
        label: "Video"
      },
      {
        value: 3,
        label: "Audio"
      },
      {
        value: 4,
        label: "Image" // Includes 3D image files Bitmap files Vector files
      },
      {
        value: 5,
        label: "Executable" // executable file
      },
      {
        value: 6,
        label: "Other"
      },
    ],
    fileCategory: [
      {
        value: "",
        label: "Unlimited",
      },
      {
        value: 0,
        label: "Philosophy",
      },
      {
        value: 1,
        label: "Religion",
      },
      {
        value: 2,
        label: "Ethics",
      },
      {
        value: 3,
        label: "Logic",
      },
      {
        value: 4,
        label: "Aesthetics",
      },
      {
        value: 5,
        label: "Psychology",
      },
      {
        value: 6,
        label: "Language",
      },
      {
        value: 7,
        label: "Literature",
      },
      {
        value: 8,
        label: "Art",
      },
      {
        value: 9,
        label: "Political",
      },
      {
        value: 10,
        label: "Economic",
      },
      {
        value: 11,
        label: "Military",
      },
      {
        value: 12,
        label: "Law",
      },

      {
        value: 13,
        label: "Education",
      },
      {
        value: 14,
        label: "Sports",
      },
      {
        value: 15,
        label: "Media",
      },
      {
        value: 16,
        label: "Information",
      },
      {
        value: 17,
        label: "Management",
      },
      {
        value: 18,
        label: "Business",
      },
      {
        value: 19,
        label: "History",
      },
      {
        value: 20,
        label: "Archaeological",
      },
      {
        value: 21,
        label: "Nation",
      },
      {
        value: 22,
        label: "Life",
      },
      {
        value: 23,
        label: "Financial",
      },
      {
        value: 24,
        label: "Statistics",
      },
      {
        value: 25,
        label: "Social",
      },
      {
        value: 26,
        label: "Music",
      },
      {
        value: 27,
        label: "Technology",
      },
      {
        value: 28,
        label: "Pet",
      },
    ],
    /**
     * in MyApprove.tsx
     */
    approveSelector: [
      {
        value: 1,
        label: "Yes"
      },
      {
        value: 2,
        label: "No"
      }
    ],
    preOfShares: [
      {
        value: 1,
        label: "1"
      },
      {
        value: 2,
        label: "2"
      },
      {
        value: 3,
        label: "3"
      },
      // {
      //   value: 4,
      //   label: "4"
      // },
      // {
      //   value: 5,
      //   label: "5"
      // },
      // {
      //   value: 6,
      //   label: "6"
      // },
      // {
      //   value: 7,
      //   label: "7"
      // },
      // {
      //   value: 8,
      //   label: "8"
      // },
      // {
      //   value: 9,
      //   label: "9"
      // },
      // {
      //   value: 10,
      //   label: "10"
      // }
    ]
  },
} as ILocale;
