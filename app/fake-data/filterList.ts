import { brands } from './brands';
import {
  Gender,
  FilterItem,
  SortOption,
  Quality,
  Size,
} from 'types/filterList';

export const convertData = (arr: string[]) => {
  let newArr = arr.map((item) => {
    return {
      name: item,
      id: item,
    };
  });
  return newArr;
};

export const categories: string[] = [
  'Category - All',
  'Tights',
  'Hat',
  'Glove',
];

export const genders: Gender[] = [
  {
    id: 'boy',
    name: 'Boys',
    color: 'blue',
  },
  {
    id: 'neutral',
    name: 'Gender Neutral',
    color: 'green',
  },
  {
    id: 'girl',
    name: 'Girls',
    color: 'pink',
  },
];

export const shippings: string[] = ['Small', 'Medium', 'Large'];

export const sortBy: SortOption[] = [
  {
    id: 'relevance',
    name: 'Relevance',
  },
  {
    id: 'newest',
    name: 'Newest',
  },
  {
    id: 'price_asc',
    name: 'Price Lowest to Highest',
  },
  {
    id: 'price_desc',
    name: 'Price Highest to Lowest',
  },
];

export const qualities: Quality[] = [
  {
    id: 'nwt',
    name: 'New With Tag',
  },
  {
    id: 'nwot',
    name: 'New Without Tag',
  },
  {
    id: 'excellent',
    name: 'Excellent Used',
  },
  {
    id: 'good',
    name: 'Good Used',
  },
  {
    id: 'play',
    name: 'Play',
  },
];

export const sizes: Size[] = [
  {
    name: 'Newborn',
    id: 'Newborn',
  },
  {
    name: '0-3 months',
    id: '0-3 months',
  },
  {
    name: '3-6 months',
    id: '3-6 months',
  },
  {
    name: '6-9 months',
    id: '6-9 months',
  },
  {
    name: '9-12 months',
    id: '9-12 months',
  },
  {
    name: '12-18 months',
    id: '12-18 months',
  },
];

export const filtersList: FilterItem[] = [
  {
    name: 'sizes',
    id: 1,
    children: sizes,
  },
  {
    name: 'brands',
    id: 2,
    children: convertData(brands),
  },
];
