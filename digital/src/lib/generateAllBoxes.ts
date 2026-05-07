import {
  LEVEL_ANCHORS_IMAGE_1,
  LEVEL_ANCHORS_IMAGE_2,
  boxesFromLevelAnchor,
  Box,
} from './boxes'

export function generateAllBoxes(): Box[] {
  return [
    ...LEVEL_ANCHORS_IMAGE_1.flatMap(a => boxesFromLevelAnchor(a)),
    ...LEVEL_ANCHORS_IMAGE_2.flatMap(a => boxesFromLevelAnchor(a)),
  ]
}
