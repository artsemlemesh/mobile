/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableHighlight,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { toDataUri, resizeImage } from './image_utils';

interface ScreenProps {
  returnToMain: () => void;
}

interface ScreenState {
  mode: 'results' | 'newStyleImage' | 'newContentImage';
  resultImage?: string;
  styleImage?: string;
  contentImage?: string;
  hasCameraPermission?: boolean;
  // tslint:disable-next-line: no-any
  cameraType: any;
  isLoading: boolean;
}

export default class CamDemo extends React.Component<ScreenProps, ScreenState> {
  private camera?: Camera | null;

  constructor(props: ScreenProps) {
    super(props);
    this.state = {
      mode: 'results',
      cameraType: Camera.Constants.Type.back,
      isLoading: true,
    };
  }

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({
      hasCameraPermission: status === 'granted',
      isLoading: false,
    });
  }

  showResults() {
    this.setState({ mode: 'results' });
  }

  takeStyleImage() {
    this.setState({ mode: 'newStyleImage' });
  }

  takeContentImage() {
    this.setState({ mode: 'newContentImage' });
  }

  flipCamera() {
    const newState =
      this.state.cameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back;
    this.setState({
      cameraType: newState,
    });
  }

  renderStyleImagePreview() {
    const { styleImage } = this.state;
    if (styleImage == null) {
      return (
        <View>
          <Text style={styles.instructionText}>Style</Text>
          <Text style={{ fontSize: 48, paddingLeft: 0 }}>💅🏽</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Image
            style={styles.imagePreview}
            source={{ uri: toDataUri(styleImage) }}
          />
          <Text style={styles.centeredText}>Style</Text>
        </View>
      );
    }
  }

  renderContentImagePreview() {
    const { contentImage } = this.state;
    if (contentImage == null) {
      return (
        <View>
          <Text style={styles.instructionText}>Stuff</Text>
          <Text style={{ fontSize: 48, paddingLeft: 0 }}>🖼️</Text>
        </View>
      );
    } else {
      return (
        <View>
          <Image
            style={styles.imagePreview}
            source={{ uri: toDataUri(contentImage) }}
          />
          <Text style={styles.centeredText}>Stuff</Text>
        </View>
      );
    }
  }

  async handleCameraCapture() {
    const { mode } = this.state;
    let { styleImage, contentImage, resultImage } = this.state;
    this.setState({
      isLoading: true,
    });
    let image = await this.camera!.takePictureAsync({
      skipProcessing: true,
    });
    image = await resizeImage(image.uri, 240);

    if (mode === 'newStyleImage' && image.base64 != null) {
      styleImage = image.base64;
      if (contentImage == null) {
        this.setState({
          styleImage,
          mode: 'results',
          isLoading: false,
        });
      } else {
        this.setState({
          styleImage,
          contentImage,
          mode: 'results',
          isLoading: false,
        });
      }
    } else if (mode === 'newContentImage' && image.base64 != null) {
      contentImage = image.base64;
      if (styleImage == null) {
        this.setState({
          contentImage,
          mode: 'results',
          isLoading: false,
        });
      } else {
        this.setState({
          contentImage,
          resultImage,
          mode: 'results',
          isLoading: false,
        });
      }
    }
  }

  renderCameraCapture() {
    const { hasCameraPermission } = this.state;

    if (hasCameraPermission === null) {
      return <ActivityIndicator />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          type={this.state.cameraType}
          ref={(ref) => {
            this.camera = ref;
          }}
        ></Camera>
        <View style={styles.cameraControls}>
          <TouchableHighlight
            style={styles.flipCameraBtn}
            onPress={() => {
              this.flipCamera();
            }}
            underlayColor="#FFDE03"
          >
            <Text style={{ fontSize: 16, color: 'white' }}>FLIP</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.takeImageBtn}
            onPress={() => {
              this.handleCameraCapture();
            }}
            underlayColor="#FFDE03"
          >
            <Text style={{ fontSize: 16, color: 'white', fontWeight: 'bold' }}>
              TAKE
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.cancelBtn}
            onPress={() => {
              this.showResults();
            }}
            underlayColor="#FFDE03"
          >
            <Text style={{ fontSize: 16, color: 'white' }}>BACK</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  renderResults() {
    const { resultImage } = this.state;
    return (
      <View>
        <View style={styles.resultImageContainer}>
          {resultImage == null ? (
            <Text style={styles.introText}>
              Tap the squares below to add style and content images and see the
              magic!
            </Text>
          ) : (
            <Image
              style={styles.resultImage}
              resizeMode="contain"
              source={{ uri: toDataUri(resultImage) }}
            />
          )}
          <TouchableHighlight
            style={styles.styleImageContainer}
            onPress={() => this.takeStyleImage()}
            underlayColor="white"
          >
            {this.renderStyleImagePreview()}
          </TouchableHighlight>

          <TouchableHighlight
            style={styles.contentImageContainer}
            onPress={() => this.takeContentImage()}
            underlayColor="white"
          >
            {this.renderContentImagePreview()}
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  render() {
    const { mode, isLoading } = this.state;
    return (
      <View style={{ width: '100%' }}>
        {isLoading ? (
          <View style={[styles.loadingIndicator]}>
            <ActivityIndicator size="large" color="#FF0266" />
          </View>
        ) : null}
        {mode === 'results' ? this.renderResults() : this.renderCameraCapture()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  centeredText: {
    textAlign: 'center',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
    marginBottom: 6,
  },
  loadingIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    // flexDirection: 'row',
    // justifyContent: 'flex-end',
    zIndex: 200,
    // width: '100%'
  },
  cameraContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  camera: {
    display: 'flex',
    width: '92%',
    height: '64%',
    backgroundColor: '#f0F',
    zIndex: 1,
    borderWidth: 20,
    borderRadius: 40,
    borderColor: '#f0f',
  },
  cameraControls: {
    display: 'flex',
    flexDirection: 'row',
    width: '92%',
    justifyContent: 'space-between',
    marginTop: 40,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  flipCameraBtn: {
    backgroundColor: '#424242',
    width: 75,
    height: 75,
    borderRadius: 16,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  takeImageBtn: {
    backgroundColor: '#FF0266',
    width: 75,
    height: 75,
    borderRadius: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#424242',
    width: 75,
    height: 75,
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultImageContainer: {
    width: '100%',
    height: '100%',
    padding: 5,
    margin: 0,
    backgroundColor: '#fff',
    zIndex: 1,
  },
  resultImage: {
    width: '98%',
    height: '98%',
  },
  styleImageContainer: {
    position: 'absolute',
    width: 80,
    height: 150,
    bottom: 30,
    left: 20,
    zIndex: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(176, 222, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(176, 222, 255, 0.7)',
  },
  contentImageContainer: {
    position: 'absolute',
    width: 80,
    height: 150,
    bottom: 30,
    right: 20,
    zIndex: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 197, 161, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 197, 161, 0.7)',
  },
  imagePreview: {
    width: 78,
    height: 148,
    borderRadius: 10,
  },
  instructionText: {
    fontSize: 28,
    fontWeight: 'bold',
    paddingLeft: 5,
  },
  introText: {
    fontSize: 52,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'left',
  },
});
