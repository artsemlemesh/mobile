import React, { useContext, useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Animated, TextInput } from 'react-native';
import { Text, Input } from 'native-base';
import { Formik } from 'formik';
import { ThemeStatic } from '@app/theme';
import { AppContext } from '@app/context';
import { IListFlowValues } from '../interface';

import { styles } from '../styles';
import { listingFlowInformationValidationSchema } from '@app/utils/validation';

interface InfoCardProps {
  onNext: (n: number, values: any) => void;
  step: number;
  formValues: IListFlowValues;
  type: string;
}
const InfoCard: React.FC<InfoCardProps> = (
  { step, onNext, formValues, type },
  ref
) => {
  const { theme, filters, newresetBrand, newresetSize, multicategory } =
    useContext(AppContext);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: step == 1 ? 1 : 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [step]);

  let tagsdata = [...formValues.tags];
  const [tags, setData] = useState(tagsdata);
  const [istitle, setTitle] = useState(false);
  const [isdescription, setDescription] = useState(false);
  const [istags, setTag] = useState(false);

  const descriptionRef = useRef(null);

  const saveButtonTranslationX = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  return (
    <Animated.View
      style={[
        styles().roundedView,
        {
          opacity: opacity,
          flex: 1,
          // transform: [{ translateX: saveButtonTranslationX }],
        },
      ]}
    >
      <View style={styles(theme).roundedViewInner}>
        <Formik
          initialValues={formValues}
          validationSchema={listingFlowInformationValidationSchema}
          onSubmit={(values) => {
            onNext(2, values);
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => {
            if (values.title == 'My Bundle') {
              values.title = '';
            }
            if (values.description == 'No Description') {
              values.description = '';
            }

            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  justifyContent: 'space-evenly',
                }}
              >
                <View style={[styles().centerContainer]}>
                  <Text style={styles(theme).titleText}>Listing Details</Text>
                </View>
                <View>
                  <View style={styles(theme).section} accessible={true}>
                    {istitle && errors.title ? (
                      <Text
                        style={[
                          styles(theme).sectionText,
                          { color: ThemeStatic.badge },
                        ]}
                      >
                        {errors.title}
                      </Text>
                    ) : (
                      <Text style={styles(theme).sectionText}>
                        {!!values.title.length && 'Title'}
                      </Text>
                    )}
                    <Input
                      autoFocus
                      defaultValue={values.title}
                      onChangeText={handleChange('title')}
                      returnKeyType={'next'}
                      onSubmitEditing={() => {
                        descriptionRef?.current?._root?.focus();
                      }}
                      blurOnSubmit={false}
                      style={styles(theme).input}
                      placeholderTextColor={ThemeStatic.text02}
                      placeholder={'Descriptive title for your bundle'}
                      accessibilityLabel={'inforCard_description'}
                    />
                  </View>
                  <View style={styles(theme).description} accessible={true}>
                    {isdescription && errors.description ? (
                      <Text
                        style={[
                          styles(theme).sectionText,
                          { color: ThemeStatic.badge },
                        ]}
                      >
                        {errors.description}
                      </Text>
                    ) : (
                      <Text style={styles(theme).sectionText}>
                        {!!values.description.length && 'Description'}
                      </Text>
                    )}
                    <TextInput
                      ref={descriptionRef}
                      defaultValue={values.description}
                      onChangeText={handleChange('description')}
                      rowSpan={6}
                      style={styles(theme).input}
                      placeholderTextColor={ThemeStatic.text02}
                      placeholder={'Why should somebody buy your bundle?'}
                      accessibilityLabel={'infoCard_reason'}
                      multiline
                    ></TextInput>
                  </View>
                </View>
                <View>
                  <View>
                    <TouchableOpacity
                      activeOpacity={0.75}
                      style={[styles().postButtonStyle]}
                      onPress={() => {
                        if (values.title.length === 0) {
                          setTitle(true);
                        }
                        if (values.description.length === 0) {
                          setDescription(true);
                        }
                        if (values.tags.length === 0) {
                          setTag(true);
                        }
                        setFieldValue('tags', tags);
                        handleSubmit();
                      }}
                      accessibilityLabel={'infoCard_next'}
                    >
                      <Text style={styles().buttonText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          }}
        </Formik>
      </View>
    </Animated.View>
  );
};

export default InfoCard;
