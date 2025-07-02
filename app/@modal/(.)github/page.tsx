import { Github } from "@/features/github";
import { Modal } from "@/widgets";

export default function Page() {
    return (
        <Modal title="Github - abcabcp" body={<Github />} />
    );
}
