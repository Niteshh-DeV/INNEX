/**
 * INNEX letterforms rebuilt as clean geometry from the official logo artwork
 * (coordinates are the logo's source pixels). `lead` = INN, `accent` = EX.
 */
export const WORDMARK_VIEWBOX = { x: 41, y: 42, width: 1159, height: 224 }

export const WORDMARK_PATHS = {
  lead: [
    // I
    "M43 42H88Q90 42 90 44V261Q90 263 88 263H43Q41 263 41 261V44Q41 42 43 42Z",
    // N — stem + diagonal (rounded foot), then the detached upper-right stem
    "M126 42H139.2L357 210.7V259C357 265.5 345.5 266 340.4 263L176 137.7V263H126Z",
    "M307 42H357V192.6L307 155Z",
    // N (second, offset 269)
    "M395 42H408.2L626 210.7V259C626 265.5 614.5 266 609.4 263L445 137.7V263H395Z",
    "M576 42H626V192.6L576 155Z",
  ],
  accent: [
    // E — rounded top bar, then the joined middle / stem / bottom
    "M705 42H875V87H665V82A40 40 0 0 1 705 42Z",
    "M665 128H857V172H715V217H875V260H705A40 40 0 0 1 665 220Z",
    // X — chevron plus two detached arms
    "M892.5 42H960L1082.5 152.5L960 263H892.5L1009 152.5Z",
    "M1125 42H1200L1091.1 141.1L1058.5 108.5Z",
    "M1125 263H1200L1091.1 163.9L1058.5 196.5Z",
  ],
} as const

export const wordmarkViewBox = `${WORDMARK_VIEWBOX.x} ${WORDMARK_VIEWBOX.y} ${WORDMARK_VIEWBOX.width} ${WORDMARK_VIEWBOX.height}`
