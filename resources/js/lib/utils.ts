import type { InertiaLinkProps } from '@inertiajs/vue3';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Inertia
export function toUrl(href: NonNullable<InertiaLinkProps['href']>) {
    return typeof href === 'string' ? href : href?.url;
}

// Tailwind
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// String manipulation
export function capitalize(
    str: string,
    options: { perWord?: boolean; separator?: string } = {},
): string {
    if (str.length === 0) return str;

    // Apply overrides to default options (if available)
    options = {
        perWord: false,
        separator: ' ',
        ...options,
    };

    // Capitalize each word in the string
    if (options.perWord) {
        const words = str.split(options.separator as string);
        console.log({ separator: options.separator, words });
        if (words.length > 1) {
            return words.map((w) => capitalize(w)).join(options.separator);
        }
    }

    // Capitalize first letter
    return str[0].toLocaleUpperCase() + str.slice(1);
}
