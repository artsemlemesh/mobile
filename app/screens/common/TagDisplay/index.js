// @flow

import type { StyleObj } from "react-native/Libraries/StyleSheet/StyleSheetTypes";

import * as React from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from "react-native";
import {ViewPropTypes} from 'deprecated-react-native-prop-types';
import invariant from "invariant";
import { Badge } from "native-base";
import {TextPropTypes} from 'deprecated-react-native-prop-types'

const windowWidth = Dimensions.get("window").width;

type KeyboardShouldPersistTapsProps =
  | "always"
  | "never"
  | "handled"
  | false
  | true;
type RequiredProps<T> = {
  /**
   * An array of tags, which can be any type, as long as labelExtractor below
   * can extract a string from it
   */
  value: $ReadOnlyArray<T>,
  /**
   * A handler to be called when array of tags change. The parent should update
   * the value prop when this is called if they want to enable removal of tags
   */
  onChange: (items: $ReadOnlyArray<T>) => void,
  /**
   * Function to extract string value for label from item
   */
  labelExtractor: (tagData: T) => string | React.Element<any>,
  /**
   * The text currently being displayed in the TextInput following the list of
   * tags
   */
  text: string,
  /**
   * This callback gets called when the user types in the TextInput. The parent
   * should update the text prop when this is called if they want to enable
   * input. This is also where any parsing to detect new tags should occur
   */
  onChangeText: (text: string) => void,
};
type OptionalProps = {
  /**
   * If false, text input is not editable and existing tags cannot be removed.
   */
  editable: boolean,
  /**
   * Background color of tags
   */
  tagColor: string,
  /**
   * Text color of tags
   */
  tagTextColor: string,
  /**
   * Styling override for container surrounding tag text
   */
  tagContainerStyle?: StyleObj,
  /**
   * Styling override for tag's text component
   */
  tagTextStyle?: StyleObj,
  /**
   * Width override for text input's default width when it's empty and showing placeholder
   */
  inputDefaultWidth: number,
  /**
   * Color of text input
   */
  inputColor: string,
  /**
   * Any misc. TextInput props (autoFocus, placeholder, returnKeyType, etc.)
   */
  inputProps?: $PropertyType<TextInput, "props">,
  /**
   * Max height of the tag input on screen (will scroll if max height reached)
   */
  maxHeight: number,
  /**
   * Callback that gets passed the new component height when it changes
   */
  onHeightChange?: (height: number) => void,
  /**
   * Any ScrollView props (horizontal, showsHorizontalScrollIndicator, etc.)
   */
  scrollViewProps?: $PropertyType<ScrollView, "props">,
};
type Props<T> = RequiredProps<T> & OptionalProps;
type State = {
  inputWidth: number,
  wrapperHeight: number,
};

class TagDisplay<T> extends React.PureComponent<Props<T>, State> {
  static propTypes = {
    value: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    labelExtractor: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    onChangeText: PropTypes.func.isRequired,
    editable: PropTypes.bool,
    tagColor: PropTypes.string,
    tagTextColor: PropTypes.string,
    tagContainerStyle: ViewPropTypes.style,
    tagTextStyle: TextPropTypes.style,
    inputDefaultWidth: PropTypes.number,
    inputColor: PropTypes.string,
    inputProps: PropTypes.shape(TextInput.propTypes),
    maxHeight: PropTypes.number,
    onHeightChange: PropTypes.func,
    scrollViewProps: PropTypes.shape(ScrollView.propTypes),
  };
  props: Props<T>;
  state: State;
  wrapperWidth = windowWidth;
  spaceLeft = 0;
  // scroll to bottom
  contentHeight = 0;
  // refs
  TagDisplay: ?TextInput = null;
  scrollView: ?ScrollView = null;

  static defaultProps = {
    editable: true,
    tagColor: "#dddddd",
    tagTextColor: "#777777",
    inputDefaultWidth: 90,
    inputColor: "#777777",
    maxHeight: 60,
  };

  static inputWidth(
    text: string,
    spaceLeft: number,
    inputDefaultWidth: number,
    wrapperWidth: number
  ) {
    if (text === "") {
      return inputDefaultWidth;
    } else if (spaceLeft >= 100) {
      return spaceLeft - 10;
    } else {
      return wrapperWidth;
    }
  }

  constructor(props: Props<T>) {
    super(props);
    this.state = {
      inputWidth: props.inputDefaultWidth,
      wrapperHeight: 36,
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props<T>) {
    const inputWidth = TagDisplay.inputWidth(
      nextProps.text,
      this.spaceLeft,
      nextProps.inputDefaultWidth,
      this.wrapperWidth
    );
    if (inputWidth !== this.state.inputWidth) {
      this.setState({ inputWidth });
    }
    const wrapperHeight = Math.min(nextProps.maxHeight, this.contentHeight);
    if (wrapperHeight !== this.state.wrapperHeight) {
      this.setState({ wrapperHeight });
    }
  }

  UNSAFE_componentWillUpdate(nextProps: Props<T>, nextState: State) {
    if (
      this.props.onHeightChange &&
      nextState.wrapperHeight !== this.state.wrapperHeight
    ) {
      this.props.onHeightChange(nextState.wrapperHeight);
    }
  }

  measureWrapper = (event: { nativeEvent: { layout: { width: number } } }) => {
    this.wrapperWidth = event.nativeEvent.layout.width;
    const inputWidth = TagDisplay.inputWidth(
      this.props.text,
      this.spaceLeft,
      this.props.inputDefaultWidth,
      this.wrapperWidth
    );
    if (inputWidth !== this.state.inputWidth) {
      this.setState({ inputWidth });
    }
  };

  onBlur = (event: { nativeEvent: { text: string } }) => {
    invariant(Platform.OS === "ios", "only iOS gets text on TextInput.onBlur");
    this.props.onChangeText(event.nativeEvent.text);
  };

  onKeyPress = (event: { nativeEvent: { key: string } }) => {
    if (this.props.text !== "" || event.nativeEvent.key !== "Backspace") {
      return;
    }
    const tags = [...this.props.value];
    tags.pop();
    this.props.onChange(tags);
    this.scrollToEnd();
    this.focus();
  };

  focus = () => {
    invariant(this.TagDisplay, "should be set");
    this.TagDisplay.focus();
  };

  removeIndex = (index: number) => {
    const tags = [...this.props.value];
    tags.splice(index, 1);
    this.props.onChange(tags);
  };

  scrollToEnd = () => {
    const scrollView = this.scrollView;
    invariant(
      scrollView,
      "this.scrollView ref should exist before scrollToEnd called"
    );
    setTimeout(() => {
      scrollView.scrollToEnd({ animated: true });
    }, 0);
  };


  render() {
    const items = this.props.items;
    const options = this.props.options;
    let sizes = {}
    let brands = {}
    let categories = {}

      
      for (var i = 0; i < items?.length; i++) {
        if (items[i].size) {
            if(items[i].size.name){
              sizes[items[i].size.name] = 1 + (sizes[items[i].size.name] || 0);
            }else{
              let newSize = []
              if(options){
               options.sizes.map((item, index) => {
                item.children.filter((fitem, index) => {
                  if(fitem.id === items[i].size){
                    newSize.push(fitem);
                  }
                });
                });
              sizes[newSize[0].name] = 1 + (sizes[items[i].size.name] || 0)
              }
            }
        }
        if (items[i].category) {
          if(items[i].category.name){
            categories[items[i].category.name] = 1 + (categories[items[i].category.name] || 0);
          }else{
            if(options){
              let filterCategory =  [];
              options.categories.map((category_item) => {
                if (category_item.id === items[i].category) {
                  filterCategory.push(category_item);
                } else {
                  category_item.children.map((children_item) => {
                    if (children_item.id === items[i].category) {
                      filterCategory.push(children_item);
                    }
                  });
                }
              });
              categories[filterCategory[0].name] = 1 + (categories[items[i].category.name] || 0)
              }
          }
        }
        if (items[i].brand) {
          if(items[i].brand.name){
            brands[items[i].brand.name] = 1 + (brands[items[i].brand.name] || 0);
          }else{
            if(options){
              let filterBrand = options.brands.filter((item) => {
                return item.id === items[i].brand;
              });
    
              brands[filterBrand[0].name] = 1 + (brands[items[i].brand.name] || 0)
            }
          }
        }
    }
  
    const sizesOrdered = Object.keys(sizes).sort(function(a,b){return sizes[b]-sizes[a]})
    const categoriesOrdered = Object.keys(categories).sort(function(a,b){return categories[b]-categories[a]})
    const brandsOrdered = Object.keys(brands).sort(function(a,b){return brands[b]-brands[a]})
      

    let tags = sizesOrdered.map((tag, index) => (
      <Tag
        index={index}
        label={this.props.labelExtractor(tag)}
        isLastTag={this.props.value.length === index + 1}
        onLayoutLastTag={this.onLayoutLastTag}
        removeIndex={this.removeIndex}
        tagColor={'#FFD620'}
        tagTextColor={'black'}
        tagContainerStyle={this.props.tagContainerStyle}
        tagTextStyle={this.props.tagTextStyle}
        key={index}
        editable={this.props.editable}
        weight={sizes[sizesOrdered[index]]}
      />
    ));

    tags.push.apply(tags, categoriesOrdered.map((tag, index) => (
      <Tag
        index={index}
        label={this.props.labelExtractor(tag)}
        isLastTag={this.props.value.length === index + 1}
        onLayoutLastTag={this.onLayoutLastTag}
        removeIndex={this.removeIndex}
        tagColor={'#FF6520'}
        tagTextColor={this.props.tagTextColor}
        tagContainerStyle={this.props.tagContainerStyle}
        tagTextStyle={this.props.tagTextStyle}
        key={index+tags.length}
        editable={this.props.editable}
        weight={categories[categoriesOrdered[index]]}
      />
    )));
    
    tags.push.apply(tags, brandsOrdered.map((tag, index) => (
      <Tag
        index={index}
        label={this.props.labelExtractor(tag)}
        isLastTag={this.props.value.length === index + 1}
        onLayoutLastTag={this.onLayoutLastTag}
        removeIndex={this.removeIndex}
        tagColor={'#17BC7E'}
        tagTextColor={this.props.tagTextColor}
        tagContainerStyle={this.props.tagContainerStyle}
        tagTextStyle={this.props.tagTextStyle}
        key={index+tags.length}
        editable={this.props.editable}
        weight={brands[brandsOrdered[index]]}
      />
    )));
    return (
      <TouchableWithoutFeedback
        onPress={this.focus}
        style={styles.container}
        onLayout={this.measureWrapper}
      >
        <View style={[styles.wrapper]}>
        {/* <View style={[styles.wrapper, { height: this.state.wrapperHeight }]}> */}
          <ScrollView
            ref={this.scrollViewRef}
            style={styles.TagDisplayContainerScroll}
            onContentSizeChange={this.onScrollViewContentSizeChange}
            keyboardShouldPersistTaps={
              ("handled": KeyboardShouldPersistTapsProps)
            }
            {...this.props.scrollViewProps}
          >
            <View style={styles.TagDisplayContainer}>
              {tags}
              <View
                style={[
                  styles.textInputContainer,
                  { width: this.state.inputWidth },
                ]}
              >
                <TextInput
                  ref={this.TagDisplayRef}
                  blurOnSubmit={false}
                  onKeyPress={this.onKeyPress}
                  value={this.props.text}
                  style={[
                    styles.textInput,
                    {
                      width: this.state.inputWidth,
                      color: this.props.inputColor,
                    },
                  ]}
                  onBlur={Platform.OS === "ios" ? this.onBlur : undefined}
                  onChangeText={this.props.onChangeText}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholder="Start typing"
                  returnKeyType="done"
                  keyboardType="default"
                  editable={this.props.editable}
                  underlineColorAndroid="rgba(0,0,0,0)"
                  {...this.props.inputProps}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  TagDisplayRef = (TagDisplay: ?React.ElementRef<typeof TextInput>) => {
    invariant(typeof TagDisplay === "object", "TextInput ref is object");
    this.TagDisplay = TagDisplay;
  };

  scrollViewRef = (scrollView: ?React.ElementRef<typeof ScrollView>) => {
    invariant(typeof scrollView === "object", "ScrollView ref is object");
    this.scrollView = scrollView;
  };

  onScrollViewContentSizeChange = (w: number, h: number) => {
    if (this.contentHeight === h) {
      return;
    }
    const nextWrapperHeight = Math.min(this.props.maxHeight, h);
    if (nextWrapperHeight !== this.state.wrapperHeight) {
      this.setState(
        { wrapperHeight: nextWrapperHeight },
        this.contentHeight < h ? this.scrollToEnd : undefined
      );
    } else if (this.contentHeight < h) {
      this.scrollToEnd();
    }
    this.contentHeight = h;
  };

  onLayoutLastTag = (endPosOfTag: number) => {
    const margin = 3;
    this.spaceLeft = this.wrapperWidth - endPosOfTag - margin - 10;
    const inputWidth = TagDisplay.inputWidth(
      this.props.text,
      this.spaceLeft,
      this.props.inputDefaultWidth,
      this.wrapperWidth
    );
    if (inputWidth !== this.state.inputWidth) {
      this.setState({ inputWidth });
    }
  };
}

type TagProps = {
  index: number,
  label: string | React.Element<any>,
  isLastTag: boolean,
  editable: boolean,
  onLayoutLastTag: (endPosOfTag: number) => void,
  removeIndex: (index: number) => void,
  tagColor: string,
  tagTextColor: string,
  tagContainerStyle?: StyleObj,
  tagTextStyle?: StyleObj,
};
class Tag extends React.PureComponent<TagProps> {
  props: TagProps;
  static propTypes = {
    index: PropTypes.number.isRequired,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
      .isRequired,
    isLastTag: PropTypes.bool.isRequired,
    editable: PropTypes.bool.isRequired,
    onLayoutLastTag: PropTypes.func.isRequired,
    removeIndex: PropTypes.func.isRequired,
    tagColor: PropTypes.string.isRequired,
    tagTextColor: PropTypes.string.isRequired,
    tagContainerStyle: ViewPropTypes.style,
    tagTextStyle: TextPropTypes.style,
    weight: PropTypes.number,
  };
  curPos: ?number = null;

  UNSAFE_componentWillReceiveProps(nextProps: TagProps) {
    if (
      !this.props.isLastTag &&
      nextProps.isLastTag &&
      this.curPos !== null &&
      this.curPos !== undefined
    ) {
      this.props.onLayoutLastTag(this.curPos);
    }
  }

  render() {
    // const weightBadge = <Badge><Text>2</Text></Badge>
        

    let tagLabel;
    if (React.isValidElement(this.props.label)) {
      tagLabel = this.props.label;
    } else {
      tagLabel = (
        <Text
          style={[
            styles.tagText,
            { color: this.props.tagTextColor },
            this.props.tagTextStyle,
          ]}
          accessibilityLabel={this.props.label}
        >
          {this.props.label}
          
          {this.props.editable ? "\x20\xD7" : ""}
        </Text>
      );
    }
    
    const weightBadge = this.props.weight > 1 ? 
        <Badge style={{backgroundColor: 'rgba(255,255,255,0.14)', marginLeft: 5, justifyContent:'center', alignItems:'center', height: 20}}>
            <Text style={[
            styles.tagText,
            { color: this.props.tagTextColor },
            this.props.tagTextStyle,
          ]}>{this.props.weight}</Text></Badge>
        : null;

    return (
        
      <TouchableOpacity
        disabled={!this.props.editable}
        onPress={this.onPress}
        onLayout={this.onLayoutLastTag}
        style={[
          styles.tag,
          { backgroundColor: this.props.tagColor },
          this.props.tagContainerStyle,
        ]}
      >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {tagLabel}
        {weightBadge}
        </View>
      </TouchableOpacity>
    );
  }

  onPress = () => {
    this.props.removeIndex(this.props.index);
  };

  onLayoutLastTag = (event: {
    nativeEvent: { layout: { x: number, width: number } },
  }) => {
    const layout = event.nativeEvent.layout;
    this.curPos = layout.width + layout.x;
    if (this.props.isLastTag) {
      this.props.onLayoutLastTag(this.curPos);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    flex: 1,
    flexDirection: "row",
    marginTop: 3,
    marginBottom: 2,
    alignItems: "flex-start",
  },
  TagDisplayContainerScroll: {
    flex: 1,
  },
  TagDisplayContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  textInput: {
    height: 12,
    fontSize: 16,
    flex: 0.6,
    marginBottom: 6,
    padding: 0,
  },
  textInputContainer: {
    height: 12,
  },
  tag: {
    justifyContent: "center",
    marginTop: 3,
    marginRight: 3,
    padding: 7,
    height: 24,
    borderRadius: 2,
  },
  tagText: {
    // padding: 0,
    // margin: 0,
   fontSize: 10,
  },
});

export default TagDisplay;
