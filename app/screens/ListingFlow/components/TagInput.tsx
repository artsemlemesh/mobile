import React, { useContext, useRef, useEffect, useState } from 'react';
import { AppContext } from '@app/context';
import { ThemeStatic, Typography } from '@app/theme';
import { ThemeColors } from '@app/types/theme';
import { StyleSheet, Text, View, Keyboard } from 'react-native';
import TagInput from 'react-native-tag-input';

interface TagsInputProps {
  tags?: string[];
  onChangeTags: (tags: any) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({ onChangeTags, tags }) => {
  const { theme } = useContext(AppContext);
  const [text, setText] = useState('');
  const onAddTag = () => {
    onChangeTags([...tags, text]);
    setText('');
    setTimeout(() => Keyboard.dismiss(), 1000);
  };
  return (
    <View style={styles(theme).container}>
      <TagInput
        value={tags}
        onChange={(tags) => onChangeTags(tags)}
        labelExtractor={(tag) => tag}
        text={text}
        inputProps={{
          placeholder: 'Add Tag',
          returnKeyType: 'done',
          placeholderTextColor: 'gray',
          style: styles(theme).input,

          onSubmitEditing: onAddTag,
        }}
        tagColor={ThemeStatic.accent}
        tagTextStyle={{ fontSize: 12, color: 'white' }}
        tagContainerStyle={{ height: 30, borderRadius: 5 }}
        tagTextColor={theme.text01}
        onChangeText={(value) => setText(value)}
      />
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      flexDirection: 'row',
      height: 40,
      // borderColor: "grey",
      // borderWidth: 1
    },
    input: {
      //height: 30,
      color: theme.text01,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 0,
      margin: 0,
      //paddingTop: 5,
      //marginTop: 10,
      // backgroundColor: "grey"
    },
  });

export default TagsInput;
