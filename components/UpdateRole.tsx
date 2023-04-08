import React from "react";
import { Text, Button, Grid, Row, Radio } from "@nextui-org/react";
import { User } from "@prisma/client";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import ActionButton from "./forms/ActionButton";
import Radiobox from "./forms/Radiobox";
import { useMutation } from '@tanstack/react-query'
import toast from "react-hot-toast";
import router from "next/router";


export type Inputs = {
    id: string;
    role: string | null;
};

type Props = {
    user?: User;
}

type UpdateRoleProps = {
    user: User;
}

type UpdateRoleResult = {
    id: number;
    name: string;
    email: string;
    role: string;
}

const UpdateRole = ({ user }: Props) => {
    const methods = useForm<Inputs>({ defaultValues: { role: user?.role } });

    const handler = (data: Inputs) => {
        return fetch(`/api/users/${user?.id}`, {
          method: 'PATCH', body: JSON.stringify(data)
        }).then(res => res.json())
      }
    
      const mutation = useMutation(handler, {
        onSuccess: (data: UpdateRoleResult) => {
          toast.success('Role updated successfully')
          router.push(`/admin/users`)
        },
        onError: (error) => {
          toast.error('Something went wrong')
        }
      })
    
      const onSubmit: SubmitHandler<Inputs> = async data => {
        mutation.mutate(data);
      };

    return (
        <FormProvider {...methods}>
            <form className='flex flex-col max-w-lg'>
                <Grid.Container gap={1} css={{ borderRadius: "14px", padding: "0.75rem", maxWidth: "250px" }}>
                    <Grid xs={12} justify="center">
                        <Radiobox label='' name='role'/>
                    </Grid>
                    <Grid xs={12} justify="center">
                        <ActionButton value={`Edit`} color="primary"  isLoading={mutation.isLoading} onClickEvent={methods.handleSubmit(onSubmit)} />
                    </Grid>
                </Grid.Container>
            </form>
        </FormProvider>
    );
};

export default UpdateRole;