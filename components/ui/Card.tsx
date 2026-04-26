import React, { useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  Easing
} from 'react-native-reanimated';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends ViewProps {
  floating?: boolean;
  className?: string;
  delay?: number;
}

export function Card({ children, floating = false, className, delay = 0, ...props }: CardProps) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (floating) {
      try {
        translateY.value = withRepeat(
          withSequence(
            withTiming(-6, { duration: 2500, easing: Easing.inOut(Easing.sine) }),
            withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.sine) })
          ),
          -1,
          true
        );
      } catch (e) {
        console.warn('Animation failed', e);
      }
    } else {
      translateY.value = 0;
    }
  }, [floating]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[animatedStyle]}
      className={cn(
        'bg-fintrack-surface rounded-2xl p-6 shadow-sm border border-fintrack-container',
        className
      )}
      {...props}
    >
      {children}
    </Animated.View>
  );
}
