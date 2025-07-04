import { Blog } from "@/features/blog";
import { Modal } from "@/widgets";

export default function Page() {
    return (
        <Modal title="Blog" body={<Blog modal/>} />
    );
}
