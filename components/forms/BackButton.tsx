import { useRouter } from "next/router";
import { useState } from "react";
import ActionButton from "./ActionButton";


type Props = {
    url?: string;
}

const BackButton = ({ url }: Props) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    function handleBack() {
        setIsLoading(true)
        if (url) {
            router.push(url)
        } else {
            router.back()
        }
    }
    
    return (
        <ActionButton value="Back" color="primary" isBordered={true} isLoading={isLoading} onClickEvent={handleBack}/>)
}

export default BackButton;