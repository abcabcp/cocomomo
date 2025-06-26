
export default function Dock() {
    // Home
    // Chrome
    // Blog
    // Github
    // Note
    // Mail
    // Setting -> dark / white
    return (
        <nav className="z-10 absolute bottom-2 left-1/2 -translate-x-1/2">
            <ul className="flex gap-x-2">
                <li>Chorome</li>
                <li>Blog</li>
                <li>Github</li>
                <li>Note</li>
                <li>Mail</li>
                <li>Setting</li>
            </ul>
        </nav>
    )
}