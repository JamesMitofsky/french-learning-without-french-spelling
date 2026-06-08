import {
  type Icon,
  ArrowsClockwiseIcon,
  HourglassIcon,
  HandPointingIcon,
  HandWavingIcon,
  QuestionIcon,
  ThumbsUpIcon,
  EqualsIcon,
  ArrowFatRightIcon,
  RocketIcon,
  ArrowBendDownRightIcon,
  PlaceholderIcon,
  DotsThreeIcon,
  PlusIcon,
  EraserIcon,
  ProhibitIcon,
  CheckIcon,
} from '@phosphor-icons/react'

/**
 * Curated map of icon-name string (stored per pair in pairs.json) to its
 * phosphor component. Only the icons used are imported so the bundle stays
 * small. Uses the `*Icon` exports — the bare names (e.g. `Rocket`) are
 * deprecated in phosphor v2.1. Unknown names resolve to undefined; callers
 * fall back to a Play glyph.
 */
export const ICONS: Record<string, Icon> = {
  ArrowsClockwise: ArrowsClockwiseIcon,
  Hourglass: HourglassIcon,
  HandPointing: HandPointingIcon,
  HandWaving: HandWavingIcon,
  Question: QuestionIcon,
  ThumbsUp: ThumbsUpIcon,
  Equals: EqualsIcon,
  ArrowFatRight: ArrowFatRightIcon,
  Rocket: RocketIcon,
  ArrowBendDownRight: ArrowBendDownRightIcon,
  Placeholder: PlaceholderIcon,
  DotsThree: DotsThreeIcon,
  Plus: PlusIcon,
  Eraser: EraserIcon,
  Prohibit: ProhibitIcon,
  Check: CheckIcon,
}
