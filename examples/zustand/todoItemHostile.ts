export { todoItemHostile }

// A to-do text full of hostile characters — ensures that vike-react-zustand correctly escapes the store state it injects during SSR (https://github.com/vikejs/vike/issues/3463)
const todoItemHostile = `Fix O'Brien's bug: escape \\ ' " </script> <!-- and \n🚀`
