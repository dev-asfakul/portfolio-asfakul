import { describe, expect, it } from 'vitest'
import { verbOffset } from './capabilities'

describe('verbOffset', () => {
  it.each([[2, -50], [3, -33.33333333333333], [5, -20]])('derives index one offset for %s verbs', (count, expected) => {
    expect(verbOffset(1, count)).toBe(expected)
  })
})
