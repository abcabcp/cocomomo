import { Post } from "@/features/blog/post/ui";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <Post id={id} />;
}