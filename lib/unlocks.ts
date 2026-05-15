import { WORLDS } from '@/lib/worlds'

export function getUnlockState(completedIds: Set<string>) {
  function isWorldUnlocked(worldId: string): boolean {
    const worldIndex = WORLDS.findIndex((w) => w.id === worldId)
    if (worldIndex === -1) return false
    // World 1 always unlocked
    if (worldIndex === 0) return true
    // Subsequent worlds require all lessons of all units of the previous world
    const prevWorld = WORLDS[worldIndex - 1]
    return prevWorld.units.every((u) =>
      u.lessons.every((l) => completedIds.has(l.id))
    )
  }

  function isUnitUnlocked(worldId: string, unitId: string): boolean {
    if (!isWorldUnlocked(worldId)) return false

    const world = WORLDS.find((w) => w.id === worldId)
    if (!world) return false

    const unitIndex = world.units.findIndex((u) => u.id === unitId)
    if (unitIndex === -1) return false
    // First unit of a world is always unlocked (world already checked above)
    if (unitIndex === 0) return true
    // Subsequent units require all lessons of the previous unit
    const prevUnit = world.units[unitIndex - 1]
    return prevUnit.lessons.every((l) => completedIds.has(l.id))
  }

  function isLessonUnlocked(worldId: string, unitId: string, lessonId: string): boolean {
    const world = WORLDS.find((w) => w.id === worldId)
    if (!world) return false

    const unitIndex = world.units.findIndex((u) => u.id === unitId)
    if (unitIndex === -1) return false
    const unit = world.units[unitIndex]

    const lessonIndex = unit.lessons.findIndex((l) => l.id === lessonId)
    if (lessonIndex === -1) return false

    // First lesson of a unit: gate on the unit itself
    if (lessonIndex === 0) return isUnitUnlocked(worldId, unitId)

    // Any non-first lesson: previous lesson in the same unit must be completed
    return completedIds.has(unit.lessons[lessonIndex - 1].id)
  }

  return { isWorldUnlocked, isUnitUnlocked, isLessonUnlocked }
}
