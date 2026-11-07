export const navStyles = {
	base: 'flex min-h-11 items-center gap-2 rounded px-3 font-display text-lg font-bold uppercase tracking-wider transition-colors',
	active: 'bg-ink/35 text-amber',
	inactive: 'text-chalk/85 hover:bg-ink/20 hover:text-chalk'
};

export const isActive = (href: string, pathname: string) => href.split('?')[0] === pathname;
