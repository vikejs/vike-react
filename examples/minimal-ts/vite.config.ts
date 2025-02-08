import react from "@vitejs/plugin-react-swc";
import vike from "vike/plugin";
import mdx from "@mdx-js/rollup";
import { UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default {
  plugins: [vike(), mdx(), react(), tsconfigPaths()],
} satisfies UserConfig;
