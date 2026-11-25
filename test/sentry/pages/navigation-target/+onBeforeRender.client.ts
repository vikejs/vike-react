export { onBeforeRender }

async function onBeforeRender() {
  await new Promise((resolve) => setTimeout(resolve, 50))
}
