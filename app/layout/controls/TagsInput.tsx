import React, {useContext, useRef, useEffect, useState} from 'react';
import avatarPng from '@app/assets/avatars/Arnold.png';
import {IconSizes, Connections} from '@app/constants';
import {AppContext} from '@app/context';
import {ThemeStatic, Typography} from '@app/theme';
import {ThemeColors} from '@app/types/theme';
import {Image, StyleSheet, Text, View, Keyboard} from 'react-native';
import TagInput from 'react-native-tag-input';

const {FontWeights, FontSizes} = Typography;

interface TagsInputProps {
  tags?: string[];
  onChangeTags: (tags: any) => void;
  editable?: string;
}

const TagsInput: React.FC<TagsInputProps> = ({
  onChangeTags,
  tags,
  editable,
}) => {
  const {theme} = useContext(AppContext);
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
        onChange={tags => onChangeTags(tags)}
        labelExtractor={tag => tag}
        text={text}
        inputProps={{
          placeholder: 'New Tag',
          returnKeyType: 'done',
          placeholderTextColor: theme.text01,
          style: styles(theme).input,
          onSubmitEditing: onAddTag,
        }}
        editable={editable}
        tagColor={ThemeStatic.accent}
        tagTextStyle={{fontSize: 12}}
        tagContainerStyle={{height: 30, borderRadius: 5}}
        tagTextColor={theme.text01}
        onChangeText={value => setText(value)}
      />
    </View>
  );
};

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginVertical: 10,
    },
    input: {
      height: 30,
      color: theme.text01,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      marginTop: 5,
    },
  });

export default TagsInput;
