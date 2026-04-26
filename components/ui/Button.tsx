import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'expense' | 'income';
  className?: string;
  textClassName?: string;
}

export function Button({ label, variant = 'primary', className, textClassName, ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-antigravity-primary',
    secondary: 'bg-antigravity-secondary',
    ghost: 'bg-transparent border border-antigravity-outline',
    expense: 'bg-antigravity-expense',
    income: 'bg-antigravity-income',
  };

  const textVariants = {
    primary: 'text-white',
    secondary: 'text-white',
    ghost: 'text-antigravity-primary',
    expense: 'text-white',
    income: 'text-white',
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className={cn(
        'px-6 py-3 rounded-xl flex-row justify-center items-center',
        variants[variant],
        className
      )}
      {...props}
    >
      <Text className={cn('font-semibold text-base', textVariants[variant], textClassName)}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
