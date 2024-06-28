export { useData };
import { usePageContext } from './usePageContext.js';
function useData() {
    const { data } = usePageContext();
    return data;
}
