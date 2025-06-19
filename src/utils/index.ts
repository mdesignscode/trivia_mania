import { browser } from '$app/environment';

export function decodeHTMLEntities(text: string) {
        if (browser) {
                const element = document.createElement("div");
                element.innerHTML = text;
                return element.textContent || "";
        }
}

export const colorMap: { [key: string]: string } = {
        easy: "green",
        medium: "gold",
        hard: "red",
};

export function capitalize(str: string): string {
	if (!str) return '';
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

