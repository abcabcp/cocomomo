import { Progress } from "@/features/cocomomo";
import Image from "next/image";
import { Icon } from "../icon";

export function Loading() {
    return (
        <div className="fixed inset-0 flex items-center flex-col justify-center z-99 bg-black bg-opacity-80">
            <Icon name="logo" size={130} color="white" />
            <Progress />
        </div>
    );
}