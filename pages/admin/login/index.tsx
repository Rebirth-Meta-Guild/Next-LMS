import { Button, Grid } from "@nextui-org/react"
import Heading from "components/Heading"
import type { GetServerSideProps, NextPage } from "next"
import { getServerSession } from "next-auth"
import { signIn, useSession } from "next-auth/react"
import { authOptions } from "pages/api/auth/[...nextauth]"

const AdminLogin: NextPage = () => {
    const { data: session } = useSession()

    if (!session) {
        return (
            <Grid.Container>
                <Grid xs={12} justify="center">
                    <Heading> Please sign in to access this page. </Heading>
                </Grid>
                <Grid xs={12} justify="center">
                    <Button ghost color="primary" size="lg" onClick={() => signIn()}>
                        Sign in
                    </Button>
                </Grid>
            </Grid.Container>
        )
    }
    return <p>Access Denied.</p>
}

export default AdminLogin;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (session) {
        if (session.user.role == "admin" || session.user.role == "teacher") {
            return {
                redirect: {
                    destination: '/admin',
                    permanent: false,
                },
            }
        }
        else {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                },
            }
        }
    }

    return {
        props: {
            session
        },
    }
}