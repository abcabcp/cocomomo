import { Blog, BlogLayout } from "@/features/blog";
import { Modal } from "@/widgets";

export default function Page() {
    return <Modal title="Blog" body={<BlogLayout modal><Blog /></BlogLayout>} order={1} />
}
