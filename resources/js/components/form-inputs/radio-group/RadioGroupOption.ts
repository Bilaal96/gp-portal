import { capitalize } from '@/lib/utils';

/**
 * Convenience helper used to generate values for `options` prop of `/js/components/RadioGroup.vue`.
 */
export default class RadioGroupOption {
    // class property types
    #id: string;
    #label?: string;
    #value?: string;

    public constructor(id: Lowercase<string>);
    public constructor(id: string, label: string, value: string);
    public constructor(id: string, label?: string, value?: string) {
        this.#id = id;

        if (label && value) {
            this.#label = label;
            this.#value = value;
        } else {
            this.#label = capitalize(id);
            this.#value = id;
        }
    }

    public get id(): string {
        return this.#id;
    }
    public get label(): string {
        return this.#label as string;
    }
    public get value(): string {
        return this.#value as string;
    }
}
