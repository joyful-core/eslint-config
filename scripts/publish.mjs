// eslint-disable-next-line import/no-unresolved
import 'zx/globals'

import { join, dirname } from 'path'

const _dirname =
  typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url))

const tagName = Date.now()

/**
 *
 */
async function publish() {
  // 切换cwd
  await $`${join(_dirname, '..')}`
  const { exitCode, stderr } =
    await $`git ls-remote --exit-code origin --tags refs/tags/${tagName}`

  if (exitCode === 0) {
    console.log(
      `Action is not being published because version ${tagName} is already published`
    )
    return
  }
  if (exitCode !== 2) {
    throw new Error(`git ls-remote exited with ${exitCode}:\n${stderr}`)
  }

  await $`git checkout --detach`
  await $`git commit -m tag`

  await $`pnpm changeset tag`

  await $`git push --force --follow-tags origin HEAD:refs/heads/${tagName}`
}

publish()
