export { getHeadSetting };
import type { PageContext } from 'vike/types';
declare function getHeadSetting(headSetting: 'title' | 'favicon' | 'lang', pageContext: PageContext): undefined | null | string;
