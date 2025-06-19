import { browser } from '$app/environment';

export function decodeHTMLEntities(text: string) {
        if (browser) {
                const element = document.createElement("div");
                element.innerHTML = text;
                return element.textContent || "";
        }
}

