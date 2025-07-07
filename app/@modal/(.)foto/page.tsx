import { Foto } from "@/features/foto";
import { Modal } from "@/widgets";

export default function Page() {
    return (
        <Modal title="Foto" body={<Foto modal={true} />} />
    );
}
