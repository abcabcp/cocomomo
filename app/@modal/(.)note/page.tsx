import { Note } from "@/features/note";
import { Modal } from "@/widgets";

export default function Page() {
    return (
        <Modal title="Note" body={<Note />} />
    );
}
