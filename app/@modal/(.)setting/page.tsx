import { Setting } from "@/features/setting";
import { Modal } from "@/widgets";

export default function Page() {
    return (
        <Modal title="Setting" body={<Setting />} />
    );
}
