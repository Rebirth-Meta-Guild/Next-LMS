import { Badge } from "@nextui-org/react";

type Props = {
    role: string;
}

const RoleBadge = ({ role }: Props) => {
    return (
        <>
            {role === "admin" && (
                <Badge color="primary" variant="bordered">{role}</Badge>
            )}
            {role === "teacher" && (
                <Badge color="secondary" variant="bordered">{role}</Badge>
            )}
            {role === "student" && (
                <Badge variant="bordered">{role}</Badge>
            )}
        </>
    )
}

export default RoleBadge;