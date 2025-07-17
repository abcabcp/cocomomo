import { Modal } from "@/widgets";
import { BlogLayout } from "@/features/blog/ui";
import { BlogDetail } from "@/features/blog/detail/ui";

export default function Page() {
    return (
        <Modal title="Blog" body={<BlogLayout modal><BlogDetail /></BlogLayout>} />
    );
}
