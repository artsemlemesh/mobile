import { sendFeedback } from '@app/actions/signup';
import { hp } from '@app/constants';
import { BottomSheetHeader } from '@app/layout';
import { ThemeStatic, Typography } from '@app/theme';
import { ThemeColors } from '@app/types/theme';
import {
  showErrorNotification,
  showSuccessNotification,
} from '@app/utils/notifications';
import { Button, Heading, Text, TextArea, View } from 'native-base';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { AirbnbRating } from 'react-native-ratings';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import { useDispatch } from 'react-redux';

const { FontWeights, FontSizes } = Typography;

interface FeedbackBottomSheetProps {
  ref: React.Ref<any>;
}

const FeedbackBottomSheet: React.FC<FeedbackBottomSheetProps> =
  React.forwardRef(({}, ref) => {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [showDetails, setShowDetails] = useState(false);

    const handleRatingChange = (newRating: number) => {
      setRating(newRating);
      setShowDetails(true);
    };

    const handleFeedbackChange = (text: string) => {
      setFeedback(text);
    };

    const handleSubmitFeedback = () => {
      console.log(`Rating: ${rating}, Feedback: ${feedback}`);
      setShowDetails(false);
      const obj = {
        feedback: { rating, comment: feedback },
        onSuccess: () => {
          setRating(0);
          setFeedback('');
          ref.current?.close();
          showSuccessNotification('Thank you for your feedback!');
        },
        onFail: () => {
          setShowDetails(true);
          showErrorNotification('Submitting Feedback failed. Please try again');
        },
      };
      dispatch(sendFeedback(obj));
    };

    return (
      <Modalize
        ref={ref}
        scrollViewProps={{ showsVerticalScrollIndicator: false }}
        modalStyle={styles().container}
        // modalHeight={hp(50)}
        adjustToContentHeight
      >
        <View style={styles().content}>
          <BottomSheetHeader
            heading="Feedback"
            subHeading="Your sincere feedback contributes to enhancing our app."
          />
          <Heading fontSize={hp(1.75)}>Select a rating</Heading>
          <AirbnbRating
            count={5}
            reviews={[
              'Terrible',
              'Needs Improvement',
              'Okay',
              'Helpful',
              'Love it!',
            ]}
            defaultRating={0}
            size={hp(2.5)}
            onFinishRating={handleRatingChange}
          />
          {showDetails && (
            <View>
              <Heading fontSize={hp(1.75)} my={4}>
                Feedback Details
              </Heading>
              <TextArea
                h={hp(10)}
                placeholder="How can we improve.."
                value={feedback}
                onChangeText={handleFeedbackChange}
                my={3}
                fontSize={hp(1.75)}
              />
              <View style={{ flex: 1 }}>
                <Button
                  onPress={handleSubmitFeedback}
                  style={{ backgroundColor: ThemeStatic.accent }}
                  height={hp(5)}
                >
                  <Text style={{ color: 'white', fontSize: hp(1.5) }}>
                    Submit Feedback
                  </Text>
                </Button>
              </View>
            </View>
          )}
        </View>
      </Modalize>
    );
  });

const styles = (theme = {} as ThemeColors) =>
  StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: ThemeStatic.placeholder,
    },
    content: {
      flex: 1,
      marginTop: 20,
      marginBottom: 50,
    },
    label: {
      ...FontWeights.Light,
      ...FontSizes.Body,
      width: responsiveWidth(74),
      color: ThemeStatic.text01,
    },
  });

export default FeedbackBottomSheet;
