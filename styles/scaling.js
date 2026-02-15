import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base guideline dimensions (iPhone X/11/12 Pro)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

/**
 * Scale a size horizontally based on screen width
 * @param {number} size - The base size to scale
 * @returns {number} The scaled size
 */
export const horizontalScale = (size) => (width / guidelineBaseWidth) * size;

/**
 * Scale a size vertically based on screen height
 * @param {number} size - The base size to scale
 * @returns {number} The scaled size
 */
export const verticalScale = (size) => (height / guidelineBaseHeight) * size;

/**
 * Scale a size moderately (with reduced factor) for better proportions
 * @param {number} size - The base size to scale
 * @param {number} factor - The scaling factor (default 0.5)
 * @returns {number} The scaled size
 */
export const moderateScale = (size, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;

/**
 * Get responsive width percentage
 * @param {number} percentage - The percentage of screen width (0-100)
 * @returns {number} The calculated width
 */
export const wp = (percentage) => (width * percentage) / 100;

/**
 * Get responsive height percentage
 * @param {number} percentage - The percentage of screen height (0-100)
 * @returns {number} The calculated height
 */
export const hp = (percentage) => (height * percentage) / 100;
