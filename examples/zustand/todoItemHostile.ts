export { todoItemHostile }

// A to-do text full of hostile characters — ensures that vike-react-zustand correctly transfers the store state it injects during SSR without breaking out of the injected <script> (https://github.com/vikejs/vike/issues/3463)
const todoItemHostile = `Fix O'Brien's bug: escape \\ ' " </script> <!-- and \n🚀`
