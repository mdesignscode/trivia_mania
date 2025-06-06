import {
        Home,
        PuzzlePiece,
        Star
} from "svelte-hero-icons";

export const navigation = [
        { name: "Home", href: "/", icon: Home },
        {
                name: "Play",
                href: '',
                icon: PuzzlePiece,
        },
        {
                name: "Score Board",
                href: "/scoreboard",
                icon: Star,
        },
];

export const navStyles = {
        active:
                "bg-accent text-dark flex gap-2 content-center items-center hover:border-light border-2 border-accent hover:text-light hover:bg-accent-200",
        inActive: [
                "hover:bg-accent-100 hover:text-secondary",
                "rounded-md px-3 py-2 text-sm font-medium flex gap-2 content-center items-center",
        ],
};

