import { Chrome } from "@/features/chrome";
import { Modal } from "@/widgets";

export default function Page() {
    return (
        <Modal title="Chrome" body={<Chrome />} />
    );
}
