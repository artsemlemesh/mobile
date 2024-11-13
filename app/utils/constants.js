export const BLANK_TEXT_ERROR_MESSAGE = 'This is a required field.';
export const INVALID_EMAIL_ADDRESS_ERROR_MESSAGE = 'Enter a valid email.';
export const INVALID_PASSWORD_ERROR_MESSAGE =
  'must be minimum eight characters, at least one letter and one number:';
export const INVALID_PHONE_NUMBER_ERROR_MESSAGE = 'Enter a valid phone number.';
export const INVALID_DATE_ERROR_MESSAGE = 'Enter a valid date.';

export const SHIPPING_TYPES = {
  1: 'Padded Envelope',
  2: 'Medium Flat Rate',
  3: 'Large Flat Rate',
};

export const BUNDLE_STATUS = {
  ALL: 'all',

  DRAFT: 'draft',
  PUBLISHED: 'published',
  SOLD: 'sold',
};

export const BOTTOM_SHEET_TYPE = {
  EDIT: 'edit',
  NEW: 'new',
};

export const SHEET_HEADER = {
  EDIT: 'Edit Item',
  NEW: 'Add New Item to Bundle',
};

export const BUTTON_LABEL = {
  /**
   * SellingDetail
   */
  PUBLISH: 'Publish',
  UNPUBLISH: 'Unpublish',
  SOLD: 'Sold',
  /**
   * SellingDetailBottomSheet
   */
  ADD_ANOTHER: 'ADD NEXT BUNDLE ITEM',
  CANCEL: 'CANCEL',
  DONE: 'DONE ADDING ITEMS',
  UPDATE: 'UPDATE',
};

export const MINUMUM_ITEMS_IN_BUNDLE = 3;

export const ERROR_MESSAGE = {
  /**
   * SellingDetail
   */
  BUNDLE_PUBLISHED: 'Unpublish your listing before making changes.',
  BUNDLE_SOLD: 'Bundle is already sold.',
  BUNDLE_MINIMUM_ITEMS: `Please add at least ${MINUMUM_ITEMS_IN_BUNDLE} items to bundle before publishing.`,
  /**
   * SellingDetailBottomSheet
   */
  SELECT_BRAND: 'Please select the Brand',
  SELECT_CATEGORY: 'Please select the Category',
  SELECT_CONDITION: 'Please select the Condition',
  SELECT_GENDER: 'Please select the Gender',
  SELECT_SIZE: 'Please select the Size',
};

// number of images of items per page on each card
export const BUNDLE_ITEMS_PER_PAGE = 4;
