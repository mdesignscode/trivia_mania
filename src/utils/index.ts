import { browser } from '$app/environment';

export function decodeHTMLEntities(text: string) {
        if (browser) {
                const element = document.createElement("div");
                element.innerHTML = text;
                return element.textContent || "";
        }
        return "";
}

export const colorMap: { [key: string]: string } = {
        easy: "#2fd1c0",
        medium: "#ffb627",
        hard: "#ff6159",
};

export function capitalize(str: string): string {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

