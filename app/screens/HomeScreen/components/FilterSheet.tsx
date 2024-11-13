import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
// import { Form } from 'native-base';
import { Modalize } from 'react-native-modalize';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { Button } from '@app/layout';
import { AppContext } from '@app/context';
import { BottomSheetHeader } from '@app/layout';
import { ThemeStatic, Typography, Theme } from '@app/theme';
import { ThemeColors } from '@app/types/theme';
import {
  GenderPicker,
  CategoryPicker,
} from '../../ListingItem/components/molecules';
import { filtersList, sortBy, sizes, brands, genders } from '@app/fake-data';
import { SafeAreaView } from 'react-navigation';
import { useSelector, useDispatch } from 'react-redux';
import { filterData, getShopList } from '@app/actions/shop';
import RangeSlider, { Slider } from 'react-native-range-slider-expo';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const ratio = width / height;
const { FontWeights, FontSizes } = Typography;

interface FilterSheetProps {
  ref: React.Ref<any>;
  onFilterClose: () => void;
}

const FilterSheet: React.FC<FilterSheetProps> = React.forwardRef(
  ({ onFilterClose }, ref) => {
    const {
      theme,
      filters,
      size,
      updateSize,
      brand,
      updateBrand,
      resetFilters,
      category,
      updateCategory,
      selectedGender,
      updateGender,
      selectedSortby,
      updateSortby,
    } = useContext(AppContext);

    const options = useSelector((state) => state.shop.options);
    const dispatch = useDispatch();

    const [catId, setCateId] = useState([]);
    const [sizeId, setSizeId] = useState([]);
    const [brandId, setBrandsId] = useState([]);
    const [sortById, setSortById] = useState<string>('relevance');
    const [genderId, setGenderId] = useState<string>();

    const [fromValue, setFromValue] = useState(0);
    const [toValue, setToValue] = useState(500);
    const [value, setValue] = useState(0);
    const [min, setMIn] = useState(0);
    const [max, setMax] = useState(500);

    const [minItem, setMInItem] = useState(0);
    const [maxItem, setMaxItem] = useState(50);

    const [itemfromValue, setItemFromValue] = useState(0);
    const [itemtoValue, setItemToValue] = useState(50);
    const [itemvalue, setItemValue] = useState(0);

    const [shoesSize, setshoesSize] = useState([]);
    const [otherSize, setotherSize] = useState([]);

    useEffect(() => {
      if (options && options.sizes && options.sizes.length !== 0) {
        let newArray = [];
        let newArray2 = [];

        options.sizes.map((item) => {
          if (item.name === 'Shoes') {
            newArray.push(item);
          }
          if (item.name === 'Clothing') {
            newArray2.push(item);
          }
        });
        setshoesSize(newArray);
        setotherSize(newArray2);
      }
    }, [options]);

    const [multiSize, setMultiSize] = useState([]);

    const onChangeCategory = (item: string[]) => {
      if (item.length === 1) {
        if (item[0] === 'Baby Shoes') {
          setMultiSize(shoesSize);
        } else {
          setMultiSize(otherSize);
        }
      } else {
        if (item.length > 0) {
          let index = item.findIndex((item) => item === 'Baby Shoes');

          if (index === -1) {
            setMultiSize(otherSize);
          } else {
            let newSize = [...otherSize, ...shoesSize];
            setMultiSize(newSize);
          }
        }
      }
      updateCategory(item);
    };

    const onChangeSize = (item: string) => {
      updateSize(item);
    };

    const onChangeBrand = (item: string) => {
      updateBrand(item);
    };
    const onChangeGender = (item: string) => {
      updateGender(item);
    };
    const onChangeSortby = (item: string) => {
      updateSortby(item);
    };

    const applyFilterData = () => {
      let categoryData = [];

      if (selectedGender && selectedGender.length > 0) {
        categoryData.push(`items__gender=${genderId}`);
      }

      for (var i = 0; i < catId.length; i++) {
        categoryData.push(`items__category=${catId[i]}`);
      }

      for (var i = 0; i < sizeId.length; i++) {
        categoryData.push(`items__size=${sizeId[i]}`);
      }

      for (var i = 0; i < brandId.length; i++) {
        categoryData.push(`items__brand=${brandId[i]}`);
      }

      if (selectedSortby && selectedSortby.length > 0) {
        categoryData.push(`ordering=${sortById}`);
      }

      if (fromValue > 0) {
        categoryData.push(`min_price=${fromValue}`);
      }
      if (toValue > 0) {
        categoryData.push(`max_price=${toValue}`);
      }

      if (itemfromValue > 0) {
        categoryData.push(`min_items=${itemfromValue}`);
      }
      if (itemtoValue > 0) {
        categoryData.push(`max_items=${itemtoValue}`);
      }

      let filterUrl =
        categoryData.length !== 0
          ? '/listings/?' + categoryData.join('&')
          : '/listings/';

      if (categoryData.length !== 0) {
        dispatch(filterData(filterUrl));
      }
    };

    const onReset = () => {
      onChangeBrand('');
      onChangeCategory([]);
      onChangeSize('');
      onChangeSortby('');
      onChangeGender('');
      setBrandsId([]);
      setCateId([]);
      setSizeId([]);
      setSortById('');
      onChangeSortby('');
      setToValue(500);
      setFromValue(0);
      setItemToValue(50);
      setItemFromValue(0);
      setMax(500);
      setMIn(0);
      setMaxItem(50);
      setMInItem(0);
      dispatch(getShopList());
    };

    return (
      <Modalize
        //@ts-ignore
        ref={ref}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        modalStyle={styles(theme).container}
      >
        <BottomSheetHeader
          heading="Filters"
          subHeading="Categories and Sizes"
        />
        <View>
          <View>
            <SectionedMultiSelect
              IconRenderer={MaterialIcons}
              single={false}
              items={genders && genders.length > 0 ? genders : []}
              uniqueKey="name"
              subKey="children"
              selectText={'Gender'}
              selectedText=""
              showDropDowns={true}
              selectChildren={true}
              readOnlyHeadings={false}
              onSelectedItemsChange={onChangeGender}
              onSelectedItemObjectsChange={(res) => {
                let data = res.map((items) => {
                  return items.id;
                });
                setGenderId(data);
              }}
              selectedItems={selectedGender}
              colors={{ primary: ThemeStatic.accent }}
              expandDropDowns
              modalWithSafeAreaView
              showCancelButton
              modalWithTouchable
              hideSearch
              styles={{
                selectToggle: {
                  borderBottomColor: '#ddd',
                  borderBottomWidth: 0.8,
                  paddingVertical: 12,
                },
              }}
            />
          </View>
          <View>
            <SectionedMultiSelect
              IconRenderer={MaterialIcons}
              items={
                options && options.categories && options.categories.length > 0
                  ? options.categories
                  : []
              }
              uniqueKey="name"
              subKey="children"
              selectText={category.length == 0 ? 'Category' : 'Categories'}
              selectedText=""
              showDropDowns={true}
              selectChildren={true}
              readOnlyHeadings={false}
              onSelectedItemsChange={onChangeCategory}
              selectedItems={category}
              onSelectedItemObjectsChange={(res) => {
                let data = res.map((items) => {
                  return items.id;
                });
                setCateId(data);
              }}
              colors={{ primary: ThemeStatic.accent }}
              expandDropDowns
              modalWithSafeAreaView
              showCancelButton
              modalWithTouchable
              searchPlaceholderText="Search Category"
              styles={{
                selectToggle: {
                  borderBottomColor: '#ddd',
                  borderBottomWidth: 0.8,
                  paddingVertical: 12,
                },
              }}
            />
            {/* <CategoryPicker
              selectedValue={category}
              onValueChange={onChangeCategory}
              items={
                options && options.categories && options.categories.length > 0
                  ? options.categories
                  : []
              }
            /> */}
          </View>
          <View>
            <SectionedMultiSelect
              IconRenderer={MaterialIcons}
              items={
                multiSize.length > 0
                  ? multiSize
                  : otherSize && otherSize.length > 0
                  ? otherSize
                  : []
              }
              uniqueKey="name"
              subKey="children"
              selectText="Sizes"
              selectedText=""
              showDropDowns={true}
              readOnlyHeadings={false}
              selectChildren={true}
              onSelectedItemsChange={onChangeSize}
              selectedItems={size}
              onSelectedItemObjectsChange={(res) => {
                let sdata = res.map((items) => {
                  return items.id;
                });
                setSizeId(sdata);
              }}
              colors={{ primary: ThemeStatic.accent }}
              expandDropDowns
              modalWithSafeAreaView
              modalWithTouchable
              showCancelButton
              searchPlaceholderText="Search Sizes"
              styles={{
                selectToggle: {
                  borderBottomColor: '#ddd',
                  borderBottomWidth: 0.8,
                  paddingVertical: 12,
                },
              }}
            />
          </View>
          <View>
            <SectionedMultiSelect
              IconRenderer={MaterialIcons}
              items={
                options && options.brands && options.brands.length > 0
                  ? options.brands.map((x) => ({
                      ...x,
                      title: x.suggested ? x.title + ' (pending review)' : x.title,
                    }))
                  : []
              }
              uniqueKey="name"
              subKey="children"
              selectText="Brands"
              selectedText=""
              showDropDowns={true}
              selectChildren={true}
              readOnlyHeadings={false}
              onSelectedItemsChange={onChangeBrand}
              selectedItems={brand}
              onSelectedItemObjectsChange={(res) => {
                let bdata = res.map((items) => {
                  return items.id;
                });
                setBrandsId(bdata);
              }}
              colors={{ primary: ThemeStatic.accent }}
              expandDropDowns
              modalWithSafeAreaView
              modalWithTouchable
              showCancelButton
              searchPlaceholderText="Search Brands"
              styles={{
                selectToggle: {
                  borderBottomColor: '#ddd',
                  borderBottomWidth: 0.8,
                  paddingVertical: 12,
                },
              }}
            />
          </View>
          <View>
            <SectionedMultiSelect
              IconRenderer={MaterialIcons}
              single={true}
              items={sortBy}
              uniqueKey="name"
              subKey="children"
              selectText={'Sort by'}
              selectedText=""
              showDropDowns={true}
              selectChildren={true}
              readOnlyHeadings={false}
              onSelectedItemsChange={onChangeSortby}
              onSelectedItemObjectsChange={(res) => {
                let sdata = res.map((items) => {
                  return items.id;
                });
                setSortById(sdata);
              }}
              selectedItems={selectedSortby}
              colors={{ primary: ThemeStatic.accent }}
              expandDropDowns
              modalWithSafeAreaView
              modalWithTouchable
              showCancelButton
              searchPlaceholderText="Search Gender"
              styles={{
                selectToggle: {
                  borderBottomColor: '#ddd',
                  borderBottomWidth: 0.8,
                  paddingVertical: 12,
                },
              }}
            />
          </View>
        </View>
        <View style={[styles(theme).subContent, { marginTop: 20 }]}>
          <Text>
            Total Price: ${fromValue} - ${toValue}
          </Text>
        </View>
        <View
          style={[
            styles(theme).subContent,
            { marginTop: 5, alignItems: 'center', flex: 1 },
          ]}
        >
          <RangeSlider
            min={min}
            max={max}
            fromValueOnChange={(value) => setFromValue(value)}
            toValueOnChange={(value) => setToValue(value)}
            initialFromValue={0}
            fromKnobColor={ThemeStatic.accent}
            toKnobColor={ThemeStatic.accent}
            valueLabelsBackgroundColor={ThemeStatic.accent}
            inRangeBarColor={ThemeStatic.accent}
            styleSize={'small'}
          />
        </View>
        <View style={[styles(theme).subContent, { marginTop: 5 }]}>
          <Text>
            Item Price: ${itemfromValue} - ${itemtoValue}
          </Text>
        </View>
        <View
          style={[
            styles(theme).subContent,
            { marginTop: 5, alignItems: 'center', flex: 1 },
          ]}
        >
          <RangeSlider
            min={minItem}
            max={maxItem}
            fromValueOnChange={(value) => setItemFromValue(value)}
            toValueOnChange={(value) => setItemToValue(value)}
            initialFromValue={0}
            fromKnobColor={ThemeStatic.accent}
            toKnobColor={ThemeStatic.accent}
            valueLabelsBackgroundColor={ThemeStatic.accent}
            inRangeBarColor={ThemeStatic.accent}
            styleSize={'small'}
          />
        </View>
        <View
          style={[
            styles(theme).subContent,
            { marginTop: 20, paddingBottom: 50 },
          ]}
        >
          <Button
            label={'Reset'}
            labelStyle={[styles().typeText, { color: ThemeStatic.accent }]}
            onPress={() => {
              onReset();
            }}
            containerStyle={[
              styles().buttonStyle,
              { backgroundColor: 'transparent' },
            ]}
          />
          <Button
            label={'Apply'}
            labelStyle={[styles().typeText, { color: ThemeStatic.white }]}
            onPress={() => {
              onFilterClose();
              applyFilterData();
              setMIn(fromValue);
              setMax(toValue);
              setMInItem(itemfromValue);
              setMaxItem(itemtoValue);
            }}
            containerStyle={[styles().buttonStyle]}
          />
        </View>
      </Modalize>
    );
  }
);

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: theme.base,
      marginTop: height * .08,
      flex: 1,
    },
    subContent: {
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    typeText: {
      ...FontWeights.Bold,
      ...FontSizes.Caption,
      color: theme.text01,
      textAlign: 'center',
    },
    buttonStyle: {
      flex: 1,
      marginHorizontal: 5,
      height: 50,
      paddingVertical: 0,
    },
    label: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      width: responsiveWidth(74),
      color: theme.text01,
    },
    subTitle: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      width: responsiveWidth(74),
      color: theme.text01,
    },
  });

export default FilterSheet;
