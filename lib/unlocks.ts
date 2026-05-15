import { WORLDS } from '@/lib/worlds'

export function getUnlockState(completedIds: Set<string>) {
  function isLessonUnlocked(worldId: string, unitId: string, lessonId: string): boolean {
    const world = WORLDS.find((w) => w.id === worldId)
    if (!world) return false

    const unitIndex = world.units.findIndex((u) => u.id === unitId)
    if (unitIndex === -1) return false
    const unit = world.units[unitIndex]

    const lessonIndex = unit.lessons.findIndex((l) => l.id === lessonId)
    if (lessonIndex === -1) return false

    // First lesson of first unit of any world is always unlocked
    if (unitIndex === 0 && lessonIndex === 0) return true

    // First lesson of a subsequent unit: previous unit's first lesson must be completed
    if (lessonIndex === 0) {
      const prevUnit = world.units[unitIndex - 1]
      return completedIds.has(prevUnit.lessons[0].id)
    }

    // Any non-first lesson: previous lesson in the same unit must be completed
    return completedIds.has(unit.lessons[lessonIndex - 1].id)
  }

  function isUnitUnlocked(worldId: string, unitId: string): boolean {
    const world = WORLDS.find((w) => w.id === worldId)
    if (!world) return false

    const unit = world.units.find((u) => u.id === unitId)
    if (!unit || unit.lessons.length === 0) return false

    return isLessonUnlocked(worldId, unitId, unit.lessons[0].id)
  }

  return { isLessonUnlocked, isUnitUnlocked }
}
