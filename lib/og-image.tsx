import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateOgImage({
    title,
    subtitle,
    icon,
    accentColor = '#6366f1',
}: {
    title: string;
    subtitle: string;
    icon: string;
    accentColor?: string;
}) {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '80px',
                    background: 'linear-gradient(135deg, #0b0f1a 0%, #1a1f36 50%, #0b0f1a 100%)',
                    fontFamily: 'system-ui, sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        marginBottom: '32px',
                    }}
                >
                    <span style={{ fontSize: '56px' }}>{icon}</span>
                    <span
                        style={{
                            fontSize: '20px',
                            color: '#94a3b8',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase' as const,
                        }}
                    >
                        AI Kit by AINative
                    </span>
                </div>
                <div
                    style={{
                        fontSize: '64px',
                        fontWeight: 800,
                        color: '#f1f5f9',
                        lineHeight: 1.1,
                        marginBottom: '24px',
                        maxWidth: '900px',
                    }}
                >
                    {title}
                </div>
                <div
                    style={{
                        fontSize: '28px',
                        color: '#94a3b8',
                        lineHeight: 1.4,
                        maxWidth: '800px',
                    }}
                >
                    {subtitle}
                </div>
                <div
                    style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        height: '6px',
                        background: `linear-gradient(90deg, ${accentColor}, #ec4899)`,
                    }}
                />
            </div>
        ),
        { ...size }
    );
}
