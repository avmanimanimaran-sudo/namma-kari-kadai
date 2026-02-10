import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'icon';
    isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading,
    className = '',
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/30",
        secondary: "bg-secondary text-surface hover:bg-white",
        outline: "border-2 border-white/20 text-white hover:bg-white/10",
        ghost: "text-white/70 hover:text-white hover:bg-white/5",
    };

    const sizes = {
        sm: "text-sm py-2 px-4",
        md: "text-base py-3 px-6",
        lg: "text-lg py-4 px-8 w-full",
        icon: "p-3",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? (
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : null}
            {children}
        </button>
    );
};
