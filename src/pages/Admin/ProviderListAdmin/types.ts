
  
  import { Provider } from "../../../common/types/provider.type";
  
  export type SortKey = keyof Omit<Provider, 'id' | 'picture'>;
  export type SortDirection = 'asc' | 'desc';
  export type { Provider };