import type { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import { Container, Grid } from '@nextui-org/react';
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast';
import { SubmitHandler } from "react-hook-form";
import { prisma } from 'utils/prisma'

import { User } from '@prisma/client';
import Heading from 'components/Heading';
import SettingsForm, { Inputs }from 'components/forms/SettingsForm';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';

type SettingsEditProps = {
    user: User;
}

type SettingsUpdateResult = {
    id: number;
    name: string;
    email: string;
}

const SettingsEdit: NextPage<SettingsEditProps> = ({ user }) => {
    const router = useRouter()
    const { data: session } = useSession()

    const handler = (data: Inputs) => {
        return fetch(`/api/users/${user.id}`, {
            method: 'PUT', body: JSON.stringify(data)
        }).then(res => res.json())
    }

    const mutation = useMutation(handler, {
        onSuccess: (data: SettingsUpdateResult) => {
            toast.success('Settings updated successfully')
            if (session) {
                session.user.name = data.name
                session.user.email = data.email
            }      
            router.push(`/`)
        },
        onError: (error) => {
            toast.error('Something went wrong')
        }
    })

    const onSubmit: SubmitHandler<Inputs> = async data => {
        mutation.mutate(data);
      };

    return (
        <>
            <Grid.Container gap={2} justify="center">
                <Grid sm={8} xs={12}>
                    <Container>
                        <Heading>My Settings</Heading>
                        <SettingsForm user={user} onSubmit={onSubmit} isLoading={mutation.isLoading} />
                    </Container>
                </Grid>
            </Grid.Container>

        </>
    );
}

export default SettingsEdit

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions)
  
    if (!session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      }
    })
  
    if (!user) {
      return {
        notFound: true
      }
    }
  
    return {
      props: {
        user
      },
    }
  }