'use client';

import { BlogList } from "./BlogList";

export function Blog({ modal }: { modal?: boolean }) {
    return (
        <BlogList modal={modal} />
    );
}