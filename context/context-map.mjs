/**
 * Map launch directory to Zep user context.
 * Mirrors the Mem0 app_id mapping defined in CLAUDE.md.
 *
 * @param {string} launchDir - Resolved launch directory path
 * @param {string} baseUserId - Base user ID (default: "jason")
 * @returns {string} Zep user_id with context suffix
 */
export function resolveZepUserId(launchDir, baseUserId = "jason") {
  // Code context: any coding repo or conductor workspace
  if (launchDir.includes("/Code/repos/") || launchDir.includes("/conductor/workspaces/")) {
    return `${baseUserId}-code`;
  }

  // Subjectiv context: Trinity vault but NOT daily notes
  if (launchDir.includes("/Obsidian/VAULTS/Trinity") && !launchDir.includes("000 Daily Notes")) {
    return `${baseUserId}-subjectiv`;
  }

  // Personal context: daily notes + everything else
  return `${baseUserId}-personal`;
}
