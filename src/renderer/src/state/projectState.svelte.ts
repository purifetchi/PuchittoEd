export const projectState = $state({
  project: '',
  modified: false
} as {
  project: string
  modified: boolean
})

export const setModifiedFlag = (): void => {
  if (!projectState.modified) {
    projectState.modified = true
  }
}

export const resetModifiedFlag = (): void => {
  projectState.modified = false
}
