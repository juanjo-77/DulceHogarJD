import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const PressableAnimado = Animated.createAnimatedComponent(Pressable);

/** Resorte corto y firme: responde al dedo sin rebotar de más. */
const RESORTE = { damping: 18, stiffness: 420, mass: 0.6 };

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Cuánto se encoge al tocarlo. */
  escala?: number;
};

/** Cualquier cosa tocable: se hunde un poquito al presionarla para confirmar el toque. */
export function Presionable({ style, escala = 0.97, onPressIn, onPressOut, disabled, ...props }: Props) {
  const tamano = useSharedValue(1);
  const animado = useAnimatedStyle(() => ({ transform: [{ scale: tamano.value }] }));

  return (
    <PressableAnimado
      accessibilityRole="button"
      {...props}
      disabled={disabled}
      onPressIn={(e) => {
        tamano.value = withSpring(escala, RESORTE);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        tamano.value = withSpring(1, RESORTE);
        onPressOut?.(e);
      }}
      style={[style, animado, disabled && { opacity: 0.5 }]}
    />
  );
}
