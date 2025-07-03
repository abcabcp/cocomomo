export function Post({ asidePanelWidth }: { asidePanelWidth: number }) {
    return (
        <article className={`h-full`} style={{ width: `calc(100% - ${asidePanelWidth}px)` }}>
            Contents 위치
        </article>
    );
}