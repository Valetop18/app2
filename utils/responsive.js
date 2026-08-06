import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

// Motorola Edge 50 Fusion usado como referencia visual.
const BASE_WIDTH = 432;
const BASE_HEIGHT = 960;

// Límites aproximados para trabajar solo con teléfonos.
// Evitan que un valor crezca o disminuya exageradamente.
const MIN_WIDTH = 350;
const MAX_WIDTH = 480;

const limitedWidth = Math.min(Math.max(width, MIN_WIDTH), MAX_WIDTH);

const widthRatio = limitedWidth / BASE_WIDTH;

const MIN_HEIGHT = 720;
const MAX_HEIGHT = 1040;

const limitedHeight = Math.min(Math.max(height, MIN_HEIGHT), MAX_HEIGHT);

const heightRatio = limitedHeight / BASE_HEIGHT;

/**
 * Indica si estamos en un teléfono más angosto
 * que el dispositivo de referencia.
 */
export const isSmallPhone = width < 400;

/**
 * Indica si estamos en un teléfono visiblemente
 * más ancho que el dispositivo de referencia.
 */
export const isLargePhone = width > 450;

export const screenWidth = width;
export const screenHeight = height;

/**
 * Clasificación sencilla del teléfono según su ancho.
 *
 * La usaremos solo cuando un componente necesite
 * un comportamiento especial en un rango concreto.
 */
export const PHONE = {
  SMALL: width <= 375,
  MEDIUM: width > 375 && width < 450,
  LARGE: width >= 450,
};

/**
 * Devuelve un porcentaje del ancho disponible.
 *
 * Ejemplo:
 * responsiveWidth(50) devuelve el 50% del ancho.
 */
export const responsiveWidth = (percentage) => {
  return PixelRatio.roundToNearestPixel(width * (percentage / 100));
};

/**
 * Devuelve un porcentaje del alto disponible.
 *
 * Ejemplo:
 * responsiveHeight(10) devuelve el 10% del alto.
 */
export const responsiveHeight = (percentage) => {
  return PixelRatio.roundToNearestPixel(height * (percentage / 100));
};

export const responsiveVerticalSize = (size) => {
  const scale = Math.min(height / BASE_HEIGHT, 1);

  return PixelRatio.roundToNearestPixel(size * scale);
};

/**
 * Escalado proporcional exacto según el ancho del teléfono.
 *
 * Se utiliza en componentes horizontales que deben conservar
 * sus proporciones completas para caber en pantallas angostas.
 *
 * En 432 px devuelve el valor original.
 * En 350 px devuelve aproximadamente el 81 %.
 * En 480 px devuelve aproximadamente el 111 %.
 */
export const responsiveWidthScale = (
  baseValue,
  minWidth = 350,
  maxWidth = 480,
) => {
  const effectiveWidth = Math.min(Math.max(width, minWidth), maxWidth);

  const scale = effectiveWidth / BASE_WIDTH;

  return PixelRatio.roundToNearestPixel(baseValue * scale);
};

/**
 * Escalado proporcional exacto según el alto del teléfono.
 *
 * Se utiliza en bloques verticales que deben conservar sus
 * proporciones completas para caber en teléfonos más bajos.
 *
 * En 960 px devuelve el valor original.
 * En 720 px devuelve el 75 %.
 * En 1040 px devuelve aproximadamente el 108,3 %.
 */
export const responsiveHeightScale = (
  baseValue,
  minHeight = 720,
  maxHeight = 1040,
) => {
  const effectiveHeight = Math.min(
    Math.max(height, minHeight),
    maxHeight,
  );

  const scale = effectiveHeight / BASE_HEIGHT;

  return PixelRatio.roundToNearestPixel(baseValue * scale);
};

