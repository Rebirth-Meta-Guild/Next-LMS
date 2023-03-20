import { Button, Loading, NormalColors } from "@nextui-org/react";
import { MouseEventHandler } from "react";

type Props = {
    value: string;
    color: NormalColors;
    isLoading: boolean;
    isBordered?: boolean;
    onClickEvent: MouseEventHandler<HTMLButtonElement>;
}

const ActionButton = ({ value, color, isLoading, isBordered = false, onClickEvent }: Props) => {
    return (
        <Button color={color} bordered={isBordered} onClick={onClickEvent} disabled={isLoading}>
            {isLoading ? (<Loading type="points" color="currentColor" size="sm" />) : value }
        </Button>)
}

export default ActionButton;