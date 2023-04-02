import React from "react"
import { Navbar, Button, Link, Image, Text, Avatar, Dropdown, Popover, Grid } from "@nextui-org/react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from 'next/router'
import { ConnectWallet } from "@thirdweb-dev/react"

export default function NavBar() {
    const { data: session } = useSession()
    const router = useRouter()

    const collapseItems = [
        "All Courses",
        "My Courses",
        "Log Out"
    ];

    return (
        <Navbar variant="sticky">
            <Navbar.Toggle showIn="xs" />
            <Navbar.Brand css={{paddingLeft: "20px"}}>
                <Link href="/">
                    <Image width={72} height={72} alt="Rebirth LMS" src="/images/logo.png" />
                </Link>
            </Navbar.Brand>
            <Navbar.Content hideIn="xs" activeColor="warning">
                {session && (
                    <>
                        <Navbar.Link href="/" css={{ textTransform: "uppercase", fontWeight: "700 !important"  }} isActive={router.pathname == "/" ? true : false}>Home</Navbar.Link>
                        <Navbar.Link href="/admin" css={{ textTransform: "uppercase", fontWeight: "700 !important"  }} isActive={router.pathname == "/admin" ? true : false}>My Courses</Navbar.Link>
                        <Navbar.Link href="/admin/users" css={{ textTransform: "uppercase", fontWeight: "700 !important"  }} isActive={router.pathname == "/admin/users" ? true : false}>Users</Navbar.Link>
                    </>
                )}
            </Navbar.Content>
            {
                !router.pathname.startsWith("/admin") && session?.user.role != "admin" && (
                    <Navbar.Content>
                        <ConnectWallet accentColor="#EF412F" />
                    </Navbar.Content>
                )
            }
            {
                session && (
                    <Navbar.Content>
                        {session && session.user && session.user.image ? (
                            <Popover placement="bottom-right">
                                <Popover.Trigger>
                                    <Avatar src={session.user.image} color="warning" bordered />
                                </Popover.Trigger>
                                <Popover.Content css={{ p: '$4' }}>
                                    <Grid.Container css={{ mw: "270px", borderRadius: "$lg", padding: "$sm" }}>
                                        <Grid xs={12}>
                                            <Text b color="inherit">Signed in as</Text>
                                        </Grid>
                                        <Grid xs={12}>
                                            <Text b color="inherit">{session.user.email}</Text>
                                        </Grid>
                                        <Grid xs={12}>
                                            <Button size="xs" flat bordered disabled color="warning" css={{ mt: "$5" }}>
                                                {session.user.role}
                                            </Button>
                                        </Grid>
                                        <Grid xs={12}>
                                            <Button flat color="error" css={{ mt: "$5" }} onClick={() => signOut()}>
                                                Sign Out
                                            </Button>
                                        </Grid>
                                    </Grid.Container>

                                </Popover.Content>
                            </Popover>
                        ) : (
                            <Navbar.Link href="#">
                                <Button auto flat color="warning" onClick={() => signIn()}>
                                    Sign in
                                </Button>
                            </Navbar.Link>
                        )}
                    </Navbar.Content>
                )
            }
            <Navbar.Collapse>
                {collapseItems.map((item, index) => (
                    <Navbar.CollapseItem
                        key={item}
                        activeColor="secondary"
                        css={{
                            color: index === collapseItems.length - 1 ? "$error" : "",
                        }}
                        isActive={index === 2}
                    >
                        <Link
                            color="inherit"
                            css={{
                                minWidth: "100%",
                            }}
                            href="#"
                        >
                            {item}
                        </Link>
                    </Navbar.CollapseItem>
                ))}
            </Navbar.Collapse>
        </Navbar >
    )
}