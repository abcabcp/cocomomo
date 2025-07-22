import { Post } from "@/features/blog/post/ui";
import { Modal } from "@/widgets";
import { findOnePosts } from "@/entities/api/query/posts";
import { getQueryClient } from "@/shared";
import { FindOnePosts200AllOf } from "@/entities/api/model";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const queryClient = await getQueryClient();
    await queryClient.prefetchQuery({
        queryKey: ['posts', id],
        queryFn: () => findOnePosts(id)
    });
    const post = queryClient.getQueryData(['posts', id]) as FindOnePosts200AllOf;

    return <Modal title={post?.data?.title || ''} body={<Post id={id}/>} order={2} />
}
