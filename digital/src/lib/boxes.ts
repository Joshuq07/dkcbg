// src/lib/boxes.ts

export const IMAGE_WIDTH = 3300
export const IMAGE_HEIGHT = 4740

export type BoxType =
  | 'number'
  | 'star1'
  | 'star2'
  | 'star3'
  | 'star4'
  | 'check'
  | 'bang'

export type Box = {
  id: string
  label: string
  x: number
  y: number
  w: number
  h: number
  type: BoxType
  level: number
  page: 1 | 2
}

export type LevelAnchor = {
  level: number
  page: 1 | 2
  x: number
  y: number
  // optional override for level 86
  hOverride?: number
}

// Each entry defines the shape of one of the 7 boxes.
export const BOX_LAYOUT = [
  { type: 'number', dx: 0,   dy: 0, w: 62, h: 62 },
  { type: 'star1',  dx: 66,  dy: 0, w: 29, h: 62 },
  { type: 'star2',  dx: 98,  dy: 0, w: 30, h: 62 },
  { type: 'star3',  dx: 131, dy: 0, w: 29, h: 62 },
  { type: 'star4',  dx: 163, dy: 0, w: 30, h: 62 },
  { type: 'check',  dx: 197, dy: 0, w: 61, h: 62 },
  { type: 'bang',   dx: 262, dy: 0, w: 62, h: 62 },
] as const



export function boxesFromLevelAnchor(anchor: LevelAnchor): Box[] {
  return BOX_LAYOUT.map((shape, idx) => ({
    id: `L${anchor.level}_P${anchor.page}_B${idx + 1}`,
    label: `L${anchor.level} B${idx + 1}`,
    x: anchor.x + shape.dx,
    y: anchor.y + shape.dy,
    w: shape.w,
    h:
      anchor.level === 86 && anchor.page === 1 && anchor.hOverride
        ? anchor.hOverride
        : shape.h,
    type: shape.type,
    level: anchor.level,
    page: anchor.page,
  }))
}
export const LEVEL_ANCHORS_IMAGE_1: LevelAnchor[] = [
  { level: 1, page: 1, x: 533, y: 445 },
  { level: 2, page: 1, x: 533, y: 520 },
  { level: 3, page: 1, x: 533, y: 590 },
  { level: 4, page: 1, x: 533, y: 655 },
  { level: 5, page: 1, x: 533, y: 720 },
  { level: 6, page: 1, x: 533, y: 775 },
  { level: 7, page: 1, x: 533, y: 950 },
  { level: 8, page: 1, x: 533, y: 1020 },
  { level: 9, page: 1, x: 533, y: 1085 },
  { level: 10, page: 1, x: 533, y: 1150 },
  { level: 11, page: 1, x: 533, y: 1215 },
  { level: 12, page: 1, x: 533, y: 1280 },
  { level: 13, page: 1, x: 533, y: 1455 },
  { level: 14, page: 1, x: 533, y: 1525 },
  { level: 15, page: 1, x: 533, y: 1585 },
  { level: 16, page: 1, x: 533, y: 1655 },
  { level: 17, page: 1, x: 533, y: 1720 },
  { level: 18, page: 1, x: 533, y: 1785 },
  { level: 19, page: 1, x: 533, y: 1850 },
  { level: 20, page: 1, x: 533, y: 2025 },
  { level: 21, page: 1, x: 533, y: 2090 },
  { level: 22, page: 1, x: 533, y: 2155 },
  { level: 23, page: 1, x: 533, y: 2225 },
  { level: 24, page: 1, x: 533, y: 2290 },
  { level: 25, page: 1, x: 533, y: 2355 },
  { level: 26, page: 1, x: 533, y: 2420 },
  { level: 27, page: 1, x: 533, y: 2595 },
  { level: 28, page: 1, x: 533, y: 2665 },
  { level: 29, page: 1, x: 533, y: 2730 },
  { level: 30, page: 1, x: 533, y: 2795 },
  { level: 31, page: 1, x: 533, y: 2860 },
  { level: 32, page: 1, x: 533, y: 2925 },
  { level: 33, page: 1, x: 533, y: 2985 },
  { level: 34, page: 1, x: 533, y: 3165 },
  { level: 35, page: 1, x: 533, y: 3230 },
  { level: 36, page: 1, x: 533, y: 3295 },
  { level: 37, page: 1, x: 533, y: 3360 },
  { level: 38, page: 1, x: 533, y: 3425 },
  { level: 39, page: 1, x: 533, y: 3495 },
  { level: 40, page: 1, x: 533, y: 3675 },

  // RIGHT COLUMN (shifted: old 44→41, old 45→42, ..., old 90→87)
  { level: 41, page: 1, x: 2060, y: 445 },
  { level: 42, page: 1, x: 2060, y: 515 },
  { level: 43, page: 1, x: 2060, y: 580 },
  { level: 44, page: 1, x: 2060, y: 640 },
  { level: 45, page: 1, x: 2060, y: 710 },
  { level: 46, page: 1, x: 2060, y: 775 },
  { level: 47, page: 1, x: 2060, y: 955 },
  { level: 48, page: 1, x: 2060, y: 1015 },
  { level: 49, page: 1, x: 2060, y: 1085 },
  { level: 50, page: 1, x: 2060, y: 1145 },
  { level: 51, page: 1, x: 2060, y: 1215 },
  { level: 52, page: 1, x: 2060, y: 1275 },
  { level: 53, page: 1, x: 2060, y: 1460 },
  { level: 54, page: 1, x: 2060, y: 1525 },
  { level: 55, page: 1, x: 2060, y: 1590 },
  { level: 56, page: 1, x: 2060, y: 1655 },
  { level: 57, page: 1, x: 2060, y: 1720 },
  { level: 58, page: 1, x: 2060, y: 1785 },
  { level: 59, page: 1, x: 2060, y: 1855 },
  { level: 60, page: 1, x: 2060, y: 2035 },
  { level: 61, page: 1, x: 2060, y: 2095 },
  { level: 62, page: 1, x: 2060, y: 2160 },
  { level: 63, page: 1, x: 2060, y: 2225 },
  { level: 64, page: 1, x: 2060, y: 2295 },
  { level: 65, page: 1, x: 2060, y: 2355 },
  { level: 66, page: 1, x: 2060, y: 2420 },
  { level: 67, page: 1, x: 2060, y: 2605 },
  { level: 68, page: 1, x: 2060, y: 2660 },
  { level: 69, page: 1, x: 2060, y: 2730 },
  { level: 70, page: 1, x: 2060, y: 2795 },
  { level: 71, page: 1, x: 2060, y: 2860 },
  { level: 72, page: 1, x: 2060, y: 2930 },
  { level: 73, page: 1, x: 2060, y: 3105 },
  { level: 74, page: 1, x: 2060, y: 3165 },
  { level: 75, page: 1, x: 2060, y: 3235 },
  { level: 76, page: 1, x: 2060, y: 3300 },
  { level: 77, page: 1, x: 2060, y: 3370 },
  { level: 78, page: 1, x: 2060, y: 3430 },
  { level: 79, page: 1, x: 2060, y: 3495 },
  { level: 80, page: 1, x: 2060, y: 3680 },
  { level: 81, page: 1, x: 2060, y: 3745 },
  { level: 82, page: 1, x: 2060, y: 3920 },
  { level: 83, page: 1, x: 2060, y: 3990 },
  { level: 84, page: 1, x: 2060, y: 4050 },
  { level: 85, page: 1, x: 2060, y: 4110 },
  { level: 86, page: 1, x: 2060, y: 4205 },
  { level: 87, page: 1, x: 2060, y: 4310 },
]
export const LEVEL_ANCHORS_IMAGE_2: LevelAnchor[] = [
  // LEFT COLUMN (normalized to x = 523)
  { level: 88, page: 2, x: 523, y: 445 },
  { level: 89, page: 2, x: 523, y: 510 },
  { level: 90, page: 2, x: 523, y: 575 },
  { level: 91, page: 2, x: 523, y: 640 },
  { level: 92, page: 2, x: 523, y: 705 },
  { level: 93, page: 2, x: 523, y: 765 },
  { level: 94, page: 2, x: 523, y: 950 },
  { level: 95, page: 2, x: 523, y: 1010 },
  { level: 96, page: 2, x: 523, y: 1075 },
  { level: 97, page: 2, x: 523, y: 1145 },
  { level: 98, page: 2, x: 523, y: 1205 },
  { level: 99, page: 2, x: 523, y: 1275 },
  { level: 100, page: 2, x: 523, y: 1460 },
  { level: 101, page: 2, x: 523, y: 1515 },
  { level: 102, page: 2, x: 523, y: 1590 },
  { level: 103, page: 2, x: 523, y: 1655 },
  { level: 104, page: 2, x: 523, y: 1720 },
  { level: 105, page: 2, x: 523, y: 1785 },
  { level: 106, page: 2, x: 523, y: 1965 },
  { level: 107, page: 2, x: 523, y: 2025 },
  { level: 108, page: 2, x: 523, y: 2090 },
  { level: 109, page: 2, x: 523, y: 2155 },
  { level: 110, page: 2, x: 523, y: 2225 },
  { level: 111, page: 2, x: 523, y: 2290 },
  { level: 112, page: 2, x: 523, y: 2470 },
  { level: 113, page: 2, x: 523, y: 2530 },
  { level: 114, page: 2, x: 523, y: 2595 },
  { level: 115, page: 2, x: 523, y: 2660 },
  { level: 116, page: 2, x: 523, y: 2725 },
  { level: 117, page: 2, x: 523, y: 2795 },
  { level: 118, page: 2, x: 523, y: 2975 },
  { level: 119, page: 2, x: 523, y: 3040 },
  { level: 120, page: 2, x: 523, y: 3100 },
  { level: 121, page: 2, x: 523, y: 3170 },
  { level: 122, page: 2, x: 523, y: 3230 },
  { level: 123, page: 2, x: 523, y: 3300 },

  // RIGHT COLUMN (normalized to x = 2043)
{ level: 124, page: 2, x: 2050, y: 445 },
{ level: 125, page: 2, x: 2050, y: 510 },
{ level: 126, page: 2, x: 2050, y: 575 },
{ level: 127, page: 2, x: 2050, y: 640 },
{ level: 128, page: 2, x: 2050, y: 705 },
{ level: 129, page: 2, x: 2050, y: 765 },
{ level: 130, page: 2, x: 2050, y: 840 },
{ level: 131, page: 2, x: 2050, y: 1015 },
{ level: 132, page: 2, x: 2050, y: 1080 },
{ level: 133, page: 2, x: 2050, y: 1150 },
{ level: 134, page: 2, x: 2050, y: 1215 },
{ level: 135, page: 2, x: 2050, y: 1275 },
{ level: 136, page: 2, x: 2050, y: 1340 },
{ level: 137, page: 2, x: 2050, y: 1525 },
{ level: 138, page: 2, x: 2050, y: 1590 },
{ level: 139, page: 2, x: 2050, y: 1655 },
{ level: 140, page: 2, x: 2050, y: 1715 },
{ level: 141, page: 2, x: 2050, y: 1780 },
{ level: 142, page: 2, x: 2050, y: 1845 },

]
