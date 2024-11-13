import { Brand, Category, Size } from 'types/filterList';

export const getBundleProperties = (items, options) => {
  const sizes: Size[] = [];
  const categories: Category[] = [];
  const brands: Brand[] = [];

  for (let i = 0; i < items?.length; i++) {
    if (items[i].size) {
      let id: number = 0,
        name: string = '';
      if (items[i].size.name) {
        id = items[i].size.id;
        name = items[i].size.name;
      } else {
        if (options.sizes) {
          options.sizes.map((item: { children: Size[] }) => {
            item.children.filter((element) => {
              if (element.id === items[i].size) {
                id = element.id;
                name = element.name;
              }
            });
          });
        }
      }
      if (!sizes.find((item) => item.id === id)) {
        sizes.push({
          name,
          id,
        });
      }
    }
    if (items[i].category) {
      let id: number = 0,
        name: string = '';
      if (items[i].category.name) {
        id = items[i].category.id;
        name = items[i].category.name;
      } else {
        if (options.categories) {
          options.categories.map((category_item) => {
            if (category_item.id === items[i].category) {
              id = category_item.id;
              name = category_item.name;
            } else {
              category_item.children.map((children_item) => {
                if (children_item.id === items[i].category) {
                  id = children_item.id;
                  name = children_item.name;
                }
              });
            }
          });
        }
      }
      if (!categories.find((item) => item.id === id)) {
        categories.push({
          name,
          id,
        });
      }
    }
    if (items[i].brand) {
      let id: number = 0,
        name: string = '';
      if (items[i].brand.name) {
        id = items[i].brand.id;
        name = items[i].brand.name;
      } else {
        if (options.brands) {
          let filterBrand = options.brands.find(
            (item) => item.id === items[i].brand
          );
          if (filterBrand) {
            id = filterBrand.id;
            name = filterBrand.name;
          }
        }
      }
      if (!brands.find((item) => item.id === id)) {
        brands.push({
          name,
          id,
        });
      }
    }
  }

  return { sizes, brands, categories };
};
