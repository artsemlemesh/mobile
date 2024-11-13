export interface Gender {
  id: string;
  name: string;
  color: string;
}

export interface Quality {
  id: string;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
  suggested?: boolean;
  children?: [];
  slug?: string;
  title?: string;
}

export interface Size {
  name: string;
  id: string;
}

export interface FilterItem {
  name: string;
  id: number;
  children: (Gender | Quality | Size)[];
}

export interface SortOption {
  id: string;
  name: string;
}
