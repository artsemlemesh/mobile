/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
import * as ImageManipulator from 'expo-image-manipulator';


export function toDataUri(base64: string): string {
  return `data:image/jpeg;base64,${base64}`;
}
export async function resizeImage(
  imageUrl: string, width: number): Promise<ImageManipulator.ImageResult> {
const actions = [{
  resize: {
    width,
  },
}];
const saveOptions = {
  compress: 0.75,
  format: ImageManipulator.SaveFormat.JPEG,
  base64: true,
};
const res =
    await ImageManipulator.manipulateAsync(imageUrl, actions, saveOptions);
return res;
}

