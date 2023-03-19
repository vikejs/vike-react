Error.stackTraceLimit = Infinity

const cmd = parseCliArgs()

cli()

async function cli() {
  if (cmd === 'dev') {
    await import('./dev')
  }
  if (cmd === 'build') {
    await import('./build')
  }
  if (cmd === 'preview') {
    await import('./preview')
  }
}

function parseCliArgs() {
  const args = process.argv.filter(Boolean).slice(2)
  let cmd: 'dev' | 'build' | 'preview'
  const isDev = args.includes('dev')
  const isPreview = args.includes('preview')
  const isBuild = args.includes('build')
  if (isDev) {
    cmd = 'dev'
  } else if (isBuild) {
    cmd = 'build'
  } else if (isPreview) {
    cmd = 'preview'
  } else {
    throw new Error(
      `DocPress: unknown command \`$ docpress ${args.join(
        ' '
      )}\`. Known commands: \`$ docpress dev\` and \`$ docpress preview\`.`
    )
  }
  return cmd
}
