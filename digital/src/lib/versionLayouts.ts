import type { VersionId } from '@/lib/types'

export type BoxColumn =
  | 'number'
  | 'star'        
  | 'star1' | 'star2' | 'star3' | 'star4'  
  | 'check'
  | 'bang'
  | 'save'

export type VersionLevelAnchor = {
  level: number
  page: 1 | 2
  x: number
  y: number
  hOverride?: number
}

export type VersionBoxColumn = {
  type: BoxColumn
  dx: number
  dy: number
  w: number
  h: number
}

export type VersionLayout = {
  versionId: VersionId
  pages: {
    1: string   
    2: string | null  
  }
  imageWidth: number
  imageHeight: number
  levelCount: number
  hasScrapbook: boolean
  columns: VersionBoxColumn[]
  anchors: VersionLevelAnchor[]
}



const V5_ANCHORS_PAGE1: VersionLevelAnchor[] = [
  { level: 1, page: 1, x: 533, y: 445 },
  { level: 2, page: 1, x: 533, y: 510 },
  { level: 3, page: 1, x: 533, y: 575 },
  { level: 4, page: 1, x: 533, y: 640 },
  { level: 5, page: 1, x: 533, y: 705 },
  { level: 6, page: 1, x: 533, y: 770 },
  { level: 7, page: 1, x: 533, y: 954 },
  { level: 8, page: 1, x: 533, y: 1019 },
  { level: 9, page: 1, x: 533, y: 1084 },
  { level: 10, page: 1, x: 533, y: 1149 },
  { level: 11, page: 1, x: 533, y: 1214 },
  { level: 12, page: 1, x: 533, y: 1279 },
  { level: 13, page: 1, x: 533, y: 1463 },
  { level: 14, page: 1, x: 533, y: 1528 },
  { level: 15, page: 1, x: 533, y: 1593 },
  { level: 16, page: 1, x: 533, y: 1658 },
  { level: 17, page: 1, x: 533, y: 1723 },
  { level: 18, page: 1, x: 533, y: 1788 },
  { level: 19, page: 1, x: 533, y: 1853 },
  { level: 20, page: 1, x: 533, y: 2037 },
  { level: 21, page: 1, x: 533, y: 2102 },
  { level: 22, page: 1, x: 533, y: 2167 },
  { level: 23, page: 1, x: 533, y: 2232 },
  { level: 24, page: 1, x: 533, y: 2297 },
  { level: 25, page: 1, x: 533, y: 2362 },
  { level: 26, page: 1, x: 533, y: 2427 },
  { level: 27, page: 1, x: 533, y: 2611 },
  { level: 28, page: 1, x: 533, y: 2676 },
  { level: 29, page: 1, x: 533, y: 2741 },
  { level: 30, page: 1, x: 533, y: 2806 },
  { level: 31, page: 1, x: 533, y: 2871 },
  { level: 32, page: 1, x: 533, y: 2936 },
  { level: 33, page: 1, x: 533, y: 3001 },
  { level: 34, page: 1, x: 533, y: 3185 },
  { level: 35, page: 1, x: 533, y: 3250 },
  { level: 36, page: 1, x: 533, y: 3315 },
  { level: 37, page: 1, x: 533, y: 3380 },
  { level: 38, page: 1, x: 533, y: 3445 },
  { level: 39, page: 1, x: 533, y: 3510 },
  { level: 40, page: 1, x: 533, y: 3694 },
  { level: 41, page: 1, x: 2060, y: 445 },
  { level: 42, page: 1, x: 2060, y: 510 },
  { level: 43, page: 1, x: 2060, y: 575 },
  { level: 44, page: 1, x: 2060, y: 640 },
  { level: 45, page: 1, x: 2060, y: 705 },
  { level: 46, page: 1, x: 2060, y: 770 },
  { level: 47, page: 1, x: 2060, y: 954 },
  { level: 48, page: 1, x: 2060, y: 1019 },
  { level: 49, page: 1, x: 2060, y: 1084 },
  { level: 50, page: 1, x: 2060, y: 1149 },
  { level: 51, page: 1, x: 2060, y: 1214 },
  { level: 52, page: 1, x: 2060, y: 1279 },
  { level: 53, page: 1, x: 2060, y: 1463 },
  { level: 54, page: 1, x: 2060, y: 1528 },
  { level: 55, page: 1, x: 2060, y: 1593 },
  { level: 56, page: 1, x: 2060, y: 1658 },
  { level: 57, page: 1, x: 2060, y: 1723 },
  { level: 58, page: 1, x: 2060, y: 1788 },
  { level: 59, page: 1, x: 2060, y: 1853 },
  { level: 60, page: 1, x: 2060, y: 2037 },
  { level: 61, page: 1, x: 2060, y: 2102 },
  { level: 62, page: 1, x: 2060, y: 2167 },
  { level: 63, page: 1, x: 2060, y: 2232 },
  { level: 64, page: 1, x: 2060, y: 2297 },
  { level: 65, page: 1, x: 2060, y: 2362 },
  { level: 66, page: 1, x: 2060, y: 2427 },
  { level: 67, page: 1, x: 2060, y: 2611 },
  { level: 68, page: 1, x: 2060, y: 2676 },
  { level: 69, page: 1, x: 2060, y: 2741 },
  { level: 70, page: 1, x: 2060, y: 2806 },
  { level: 71, page: 1, x: 2060, y: 2871 },
  { level: 72, page: 1, x: 2060, y: 2936 },
  { level: 73, page: 1, x: 2060, y: 3120 },
  { level: 74, page: 1, x: 2060, y: 3185 },
  { level: 75, page: 1, x: 2060, y: 3250 },
  { level: 76, page: 1, x: 2060, y: 3315 },
  { level: 77, page: 1, x: 2060, y: 3380 },
  { level: 78, page: 1, x: 2060, y: 3445 },
  { level: 79, page: 1, x: 2060, y: 3510 },
  { level: 80, page: 1, x: 2060, y: 3694 },
  { level: 81, page: 1, x: 2060, y: 3759 },
  { level: 82, page: 1, x: 2060, y: 3943 },
  { level: 83, page: 1, x: 2060, y: 4008 },
  { level: 84, page: 1, x: 2060, y: 4073 },
  { level: 85, page: 1, x: 2060, y: 4138 },
  { level: 86, page: 1, x: 2060, y: 4235, hOverride: 60 },
  { level: 87, page: 1, x: 2060, y: 4333 },
]

const V5_ANCHORS_PAGE2: VersionLevelAnchor[] = [
  { level: 88, page: 2, x: 524, y: 445 },
  { level: 89, page: 2, x: 524, y: 510 },
  { level: 90, page: 2, x: 524, y: 575 },
  { level: 91, page: 2, x: 524, y: 640 },
  { level: 92, page: 2, x: 524, y: 705 },
  { level: 93, page: 2, x: 524, y: 770 },
  { level: 94, page: 2, x: 524, y: 954 },
  { level: 95, page: 2, x: 524, y: 1019 },
  { level: 96, page: 2, x: 524, y: 1084 },
  { level: 97, page: 2, x: 524, y: 1149 },
  { level: 98, page: 2, x: 524, y: 1214 },
  { level: 99, page: 2, x: 524, y: 1279 },
  { level: 100, page: 2, x: 524, y: 1463 },
  { level: 101, page: 2, x: 524, y: 1528 },
  { level: 102, page: 2, x: 524, y: 1593 },
  { level: 103, page: 2, x: 524, y: 1658 },
  { level: 104, page: 2, x: 524, y: 1723 },
  { level: 105, page: 2, x: 524, y: 1788 },
  { level: 106, page: 2, x: 524, y: 1972 },
  { level: 107, page: 2, x: 524, y: 2037 },
  { level: 108, page: 2, x: 524, y: 2102 },
  { level: 109, page: 2, x: 524, y: 2167 },
  { level: 110, page: 2, x: 524, y: 2232 },
  { level: 111, page: 2, x: 524, y: 2297 },
  { level: 112, page: 2, x: 524, y: 2481 },
  { level: 113, page: 2, x: 524, y: 2546 },
  { level: 114, page: 2, x: 524, y: 2611 },
  { level: 115, page: 2, x: 524, y: 2676 },
  { level: 116, page: 2, x: 524, y: 2741 },
  { level: 117, page: 2, x: 524, y: 2806 },
  { level: 118, page: 2, x: 524, y: 2990 },
  { level: 119, page: 2, x: 524, y: 3055 },
  { level: 120, page: 2, x: 524, y: 3120 },
  { level: 121, page: 2, x: 524, y: 3185 },
  { level: 122, page: 2, x: 524, y: 3250 },
  { level: 123, page: 2, x: 524, y: 3315 },
  { level: 124, page: 2, x: 2051, y: 445 },
  { level: 125, page: 2, x: 2051, y: 510 },
  { level: 126, page: 2, x: 2051, y: 575 },
  { level: 127, page: 2, x: 2051, y: 640 },
  { level: 128, page: 2, x: 2051, y: 705 },
  { level: 129, page: 2, x: 2051, y: 770 },
  { level: 130, page: 2, x: 2051, y: 835 },
  { level: 131, page: 2, x: 2051, y: 1019 },
  { level: 132, page: 2, x: 2051, y: 1084 },
  { level: 133, page: 2, x: 2051, y: 1149 },
  { level: 134, page: 2, x: 2051, y: 1214 },
  { level: 135, page: 2, x: 2051, y: 1279 },
  { level: 136, page: 2, x: 2051, y: 1344 },
  { level: 137, page: 2, x: 2051, y: 1528 },
  { level: 138, page: 2, x: 2051, y: 1593 },
  { level: 139, page: 2, x: 2051, y: 1658 },
  { level: 140, page: 2, x: 2051, y: 1723 },
  { level: 141, page: 2, x: 2051, y: 1788 },
  { level: 142, page: 2, x: 2051, y: 1853 },
]



const V5_COLUMNS: VersionBoxColumn[] = [
  { type: 'number', dx: 0,   dy: 0, w: 62, h: 62 },
  { type: 'star1',  dx: 66,  dy: 0, w: 29, h: 62 },
  { type: 'star2',  dx: 98,  dy: 0, w: 30, h: 62 },
  { type: 'star3',  dx: 131, dy: 0, w: 29, h: 62 },
  { type: 'star4',  dx: 163, dy: 0, w: 30, h: 62 },
  { type: 'check',  dx: 197, dy: 0, w: 61, h: 62 },
  { type: 'bang',   dx: 262, dy: 0, w: 62, h: 62 },
  { type: 'save',   dx: 327, dy: 0, w: 62, h: 62 },
]



const V3_COLUMNS: VersionBoxColumn[] = [
  { type: 'number', dx: 0,   dy: 0, w: 62, h: 62 },
  { type: 'star',   dx: 66,  dy: 0, w: 29, h: 62 },
  { type: 'check',  dx: 98,  dy: 0, w: 61, h: 62 },
  { type: 'bang',   dx: 162, dy: 0, w: 62, h: 62 },
]



const V1_COLUMNS: VersionBoxColumn[] = [
  { type: 'number', dx: 0,   dy: 0, w: 62, h: 62 },
  { type: 'check',  dx: 66,  dy: 0, w: 61, h: 62 },
  { type: 'bang',   dx: 130, dy: 0, w: 62, h: 62 },
]


export const VERSION_LAYOUTS: Record<VersionId, VersionLayout> = {
  'v1.0': {
    versionId: 'v1.0',
    pages: { 1: '/v1/page1.png', 2: '/v1/page2.png' },  
    imageWidth: 3300,
    imageHeight: 4740,
    levelCount: 40,   
    hasScrapbook: false,
    columns: V1_COLUMNS,
    anchors: V5_ANCHORS_PAGE1.filter(a => a.level <= 40),
  },
  'v1.1': {
    versionId: 'v1.1',
    pages: { 1: '/v1/page1.png', 2: '/v1/page2.png' },
    imageWidth: 3300,
    imageHeight: 4740,
    levelCount: 40,
    hasScrapbook: false,
    columns: V1_COLUMNS,
    anchors: V5_ANCHORS_PAGE1.filter(a => a.level <= 40),
  },
  'v2.0': {
    versionId: 'v2.0',
    pages: { 1: '/v2/page1.png', 2: '/v2/page2.png' },
    imageWidth: 3300,
    imageHeight: 4740,
    levelCount: 87,  
    hasScrapbook: false,
    columns: V1_COLUMNS,
    anchors: V5_ANCHORS_PAGE1,
  },
  'v3.0': {
    versionId: 'v3.0',
    pages: { 1: '/v3/page1.png', 2: '/v3/page2.png' },
    imageWidth: 3300,
    imageHeight: 4740,
    levelCount: 142,
    hasScrapbook: false,
    columns: V3_COLUMNS,
    anchors: [...V5_ANCHORS_PAGE1, ...V5_ANCHORS_PAGE2],
  },
  'v3.1': {
    versionId: 'v3.1',
    pages: { 1: '/v3/page1.png', 2: '/v3/page2.png' },
    imageWidth: 3300,
    imageHeight: 4740,
    levelCount: 142,
    hasScrapbook: false,
    columns: V3_COLUMNS,
    anchors: [...V5_ANCHORS_PAGE1, ...V5_ANCHORS_PAGE2],
  },
  'v4.2': {
    versionId: 'v4.2',
    pages: { 1: '/v4/page1.png', 2: '/v4/page2.png' },
    imageWidth: 3300,
    imageHeight: 4740,
    levelCount: 142,
    hasScrapbook: false,
    columns: V3_COLUMNS,
    anchors: [...V5_ANCHORS_PAGE1, ...V5_ANCHORS_PAGE2],
  },
  'v4.3': {
    versionId: 'v4.3',
    pages: { 1: '/v4/page1.png', 2: '/v4/page2.png' },
    imageWidth: 3300,
    imageHeight: 4740,
    levelCount: 142,
    hasScrapbook: true,
    columns: V3_COLUMNS,
    anchors: [...V5_ANCHORS_PAGE1, ...V5_ANCHORS_PAGE2],
  },
  'v5.0': {
    versionId: 'v5.0',
    pages: { 1: '/page1.png', 2: '/page2.png' },
    imageWidth: 3300,
    imageHeight: 4740,
    levelCount: 142,
    hasScrapbook: true,
    columns: V5_COLUMNS,
    anchors: [...V5_ANCHORS_PAGE1, ...V5_ANCHORS_PAGE2],
  },
}