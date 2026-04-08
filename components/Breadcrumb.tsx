import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
    const allItems = [{ label: 'Home', href: '/' }, ...items];

    return (
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 py-4">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                {allItems.map((item, index) => (
                    <li key={item.label} className="flex items-center gap-2">
                        {index > 0 && <span aria-hidden="true">/</span>}
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-foreground">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

export function breadcrumbJsonLd(items: { label: string; href?: string }[]) {
    const allItems = [{ label: 'Home', href: '/' }, ...items];
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: allItems.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            item: item.href
                ? `https://aikit.ainative.studio${item.href}`
                : undefined,
        })),
    };
}
