import React, { useState, createContext } from 'react';
import { Theme } from '@app/theme';
import { ThemeColors } from '@app/types/theme';
import { saveThemeType } from '@app/utils/reduxStore';
import { categories, genders, sortBy, qualities } from '@app/fake-data';

import Analytics from '@app/utils/Analytics';

type UserType = {
  id: string;
  avatar: string;
  handle: string;
  avatarBackground: string;
  description: string;
  name: string;
  mail: string;
};

type AppContextType = {
  user: UserType;
  updateUser: (user: UserType) => void;
  theme: ThemeColors;
  themeType: string;
  toggleTheme: (type: string) => void;
  unreadMessages: number;
  updateUnreadMessages: (count: number) => void;
  size: string[];
  updateSize: (option: string[]) => void;
  brand: string[];
  updateBrand: (option: string[]) => void;
  updateFilters: (option: string) => void;
  selectedSize: string[];
  selectSize: (items: string[]) => void;
  selectedBrand: string[];
  selectBrand: (items: string[]) => void;
  filters: string[];
  resetFilters: (items: string[]) => void;
  newresetBrand: string[];
  resetBrand: (items: string[]) => void;
  newresetSize: string[];
  resetSize: (items: string[]) => void;
  category: string[];
  multicategory: string[];
  removeMultiple: (item: string) => void;
  updateCategory: (item: string[]) => void;
  selectedGender: string[];
  updateGender: (item: string[]) => void;
  selectQulity: string;
  updateQulity: (item: string) => void;
  selectedSortby: string;
  updateSortby: (item: string) => void;
  isFavorite: boolean;
  toggleFavorite: () => void;
  setOpen: boolean;
  toggleSetOpenModal: (type: boolean) => void;
  videoPlayStatus: (type: boolean) => void;
  videoStatus: boolean;
  isBack: boolean;
  isBackToScreen: (type: boolean) => void;
  isAddBack: boolean;
  onAddBackToScreen: (type: boolean) => void;
};

export const AppContext = createContext({} as AppContextType);

export const AppContextProvider = (props) => {
  const [user, setUser] = useState({
    avatarBackground: 'https://randomuser.me/api/portraits/women/65.jpg',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    id: '',
    handle: '',
    name: 'Sage K',
    mail: '@sagesparkles',
    description:
      'I have 2 kids ages 2 and 4. I enjoy cooking, hiking, and finding great deals.',
  });
  const [theme, setTheme] = useState(Theme.light.colors);
  const [themeType, setThemeType] = useState(Theme.light.type);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [filters, setFilters] = useState<any>([]);
  const [newresetBrand, setresetBrand] = useState<any>([]);
  const [newresetSize, setresetSize] = useState<any>([]);
  const [size, setSize] = useState<any>([]);
  const [brand, setBrand] = useState<any>([]);
  const [category, setCategory] = useState<any>([]);
  const [selectedGender, setGender] = useState<any>([]);
  const [selectQulity, setselectQulity] = useState<any>([]);
  const [selectedSortby, setSortby] = useState<any>([sortBy[0].name]);
  const [isFavorite, setFavorite] = useState(false);
  const [setOpen, setOpenModal] = useState(false);
  const [multicategory, setMulticategory] = useState<any>([]);
  const [videoStatus, setVideoStatus] = useState<boolean>(true);
  const [isBack, setIsBack] = useState<boolean>(false);
  const [isAddBack, setIsAddBack] = useState<boolean>(false);

  const updateUser = (user: UserType) => {
    setUser(user);
    Analytics.identify(user.id);
  };

  const toggleTheme = (type: string) => {
    setTheme(Theme[type].colors);
    setThemeType(type);
  };

  const toggleFavorite = () => {
    setFavorite(!isFavorite);
    setFilters([]);
  };

  const toggleSetOpenModal = (type: boolean) => {
    setOpenModal(type);
  };
  const videoPlayStatus = (type: boolean) => {
    setVideoStatus(type);
  };

  const updateUnreadMessages = (count: number) => {
    setUnreadMessages(count);
  };

  const updateFilters = (option: string) => {
    setFavorite(false);
    let payload = filters;
    if (payload.includes(option)) {
      payload = payload.filter((item) => item != option);
    } else {
      payload = [...payload, option];
    }
    setFilters(payload);
  };

  const resetFilters = (items: string[]) => {
    setFilters(items);
  };

  const resetBrand = (items: string[]) => {
    setresetBrand(items);
  };

  const resetSize = (items: string[]) => {
    setresetSize(items);
  };

  const updateCategory = (item: string[]) => {
    setCategory(item);
  };

  const updateSize = (item: string[]) => {
    setSize(item);
  };

  const updateBrand = (item: string[]) => {
    setBrand(item);
  };

  const updateGender = (item: string[]) => {
    setGender(item);
  };

  const updateQulity = (item: string) => {
    setselectQulity(item);
  };

  const updateSortby = (item: string) => {
    setSortby(item);
  };
  const removeMultiple = (item: string[]) => {
    setMulticategory(item);
  };

  const isBackToScreen = (item: any) => {
    setIsBack(item);
  };
  const onAddBackToScreen = (item: any) => {
    setIsAddBack(item);
  };

  const value = {
    user,
    updateUser,
    theme,
    themeType,
    toggleTheme,
    unreadMessages,
    updateUnreadMessages,
    filters,
    updateFilters,
    resetFilters,
    category,
    multicategory,
    removeMultiple,
    updateCategory,
    selectedGender,
    updateGender,
    selectedSortby,
    updateSortby,
    isFavorite,
    toggleFavorite,
    setOpen,
    toggleSetOpenModal,
    size,
    updateSize,
    brand,
    updateBrand,
    newresetBrand,
    resetBrand,
    newresetSize,
    resetSize,
    selectQulity,
    updateQulity,
    videoPlayStatus,
    videoStatus,
    isBack,
    isBackToScreen,
    onAddBackToScreen,
    isAddBack,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
