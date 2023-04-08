import React, { useEffect, useState } from "react"
import { Navbar, Button, Link, Image, Text, Avatar, Popover, Grid } from "@nextui-org/react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from 'next/router'
import ConnectWalletButton from "./ConnectWallet"
import { useDisconnect } from "wagmi"
import RoleBadge from "./RoleBadge"

export default function NavBar() {
    const router = useRouter()
    const { data: session } = useSession()
    const { disconnect } = useDisconnect()
    
    const studentMenu = [
        "Home",
        "Settings"
    ];

    const teacherMenu = [
        "Home",
        "My Courses"
    ];

    const adminMenu = [
        "Home",
        "My Courses",
        "Users"
    ];

    function getActiveMenu() {
        if (session) {
            if (session.user.role == "student") {
                return studentMenu
            } else if (session.user.role == "teacher") {
                return teacherMenu
            } else if (session.user.role == "admin") {
                return adminMenu
            }
        }

        return []
    }

    function getLink(menu: string) {
        if (menu == "Home") {
            return "/";
        } else if (menu == "Settings") {
            return "/settings";
        } else if (menu == "My Courses") {
            return "/admin";
        } else if (menu == "Users") {
            return "/admin/users";
        }
    }

    function isActive(menu: string) {
        var isActive = false;
        if (menu == "Home" && router.pathname === "/") {
            isActive = true;
        } else if (menu == "Settings" && router.pathname === "/settings") {
            isActive = true;
        } else if (menu == "My Courses" && router.pathname == "/admin") {
            isActive = true;
        } else if (menu == "Users" && router.pathname == "/admin/users") {
            isActive = true;
        }

        return isActive;
    }

    function logOut() {
        disconnect()
        signOut()
    }

    return (
        <Navbar variant="sticky">
            <Navbar.Toggle showIn="xs" />
            <Navbar.Brand css={{ paddingLeft: "20px" }}>
                <Link href="/">
                    <Image width={72} height={72} alt="Rebirth LMS" src="/images/logo.png" />
                </Link>
            </Navbar.Brand>
            <Navbar.Content hideIn="xs" activeColor="primary">
                {session && (
                    session.user.role != "student" ? (
                        <>
                            <Navbar.Link href="/" css={{ textTransform: "uppercase", fontWeight: "700 !important" }} isActive={router.pathname == "/" ? true : false}>Home</Navbar.Link>
                            <Navbar.Link href="/admin" css={{ textTransform: "uppercase", fontWeight: "700 !important" }} isActive={router.pathname == "/admin" ? true : false}>My Courses</Navbar.Link>
                            {session.user.role == "admin" && (
                                <Navbar.Link href="/admin/users" css={{ textTransform: "uppercase", fontWeight: "700 !important" }} isActive={router.pathname == "/admin/users" ? true : false}>Users</Navbar.Link>
                            )}
                        </>
                    ) :
                        session.user.metamaskAddress ?
                            (
                                <>
                                    <Navbar.Link href="/" css={{ textTransform: "uppercase", fontWeight: "700 !important" }} isActive={router.pathname == "/" ? true : false}>Home</Navbar.Link>
                                    <Navbar.Link href="/settings" css={{ textTransform: "uppercase", fontWeight: "700 !important" }} isActive={router.pathname == "/settings" ? true : false}>Settings</Navbar.Link>
                                </>
                            ) : <></>
                )}
            </Navbar.Content>

            <Navbar.Content hideIn="xs">
                {session == null && !router.pathname.startsWith("/admin") && (
                    <ConnectWalletButton />
                )}
                {session && session.user ? (
                    <Popover placement="bottom-right">
                        <Popover.Trigger>
                            {session.user.metamaskAddress ?
                                <Button bordered color="primary" css={{ mt: "$5" }}>
                                    {session.user.metamaskAddress.slice(0, 4) + "..." + session.user.metamaskAddress.slice(-4)}
                                </Button>
                                :
                                session.user.image ?
                                    <Avatar src={session.user.image} color="primary" bordered />
                                    :
                                    <Avatar src="/images/logo.png" color="primary" bordered />
                            }
                        </Popover.Trigger>
                        <Popover.Content css={{ p: '$4' }}>
                            <Grid.Container css={{ mw: "270px", borderRadius: "$lg", padding: "$sm" }}>
                                <Grid xs={12}>
                                    <Text b color="inherit">Signed in as</Text>
                                </Grid>
                                <Grid xs={12}>
                                    <Text b color="inherit">{session.user.name}</Text>
                                </Grid>
                                <Grid xs={12}>
                                    <RoleBadge role={session.user.role} />
                                </Grid>
                                <Grid xs={12}>
                                    <Button bordered color="error" css={{ mt: "$5" }} onClick={() => logOut()}>
                                        Sign Out
                                    </Button>
                                </Grid>
                            </Grid.Container>

                        </Popover.Content>
                    </Popover>
                ) : (
                    <></>
                )}
            </Navbar.Content>
            <Navbar.Content showIn="xs">
                {session == null && !router.pathname.startsWith("/admin") && (
                    <ConnectWalletButton isXs={true} />
                )}
                {session && session.user ? (
                    <Popover placement="bottom-right">
                        <Popover.Trigger>
                            {session.user.image ?
                                <Avatar src={session.user.image} color="primary" bordered />
                                :
                                <Avatar src="/images/user.png" color="primary" bordered />
                            }
                        </Popover.Trigger>
                        <Popover.Content css={{ p: '$4' }}>
                            <Grid.Container css={{ mw: "270px", borderRadius: "$lg", padding: "$sm" }}>
                                <Grid xs={12}>
                                    <Text b color="inherit">Signed in as</Text>
                                </Grid>
                                <Grid xs={12}>
                                    <Text b color="inherit">
                                        {session.user.metamaskAddress ? session.user.metamaskAddress.slice(0, 4) + "..." + session.user.metamaskAddress.slice(-4) : session.user.name}
                                    </Text>
                                </Grid>
                                <Grid xs={12}>
                                    <RoleBadge role={session.user.role} />
                                </Grid>
                                <Grid xs={12}>
                                    <Button bordered color="error" css={{ mt: "$5" }} onClick={() => logOut()}>
                                        Sign Out
                                    </Button>
                                </Grid>
                            </Grid.Container>

                        </Popover.Content>
                    </Popover>
                ) : (
                    <></>
                )}
            </Navbar.Content>
            <Navbar.Collapse>
                {getActiveMenu().map((item, index) => (
                    <Navbar.CollapseItem key={item} activeColor="primary" isActive={isActive(item)}>
                        <Link color="inherit" css={{ minWidth: "100%" }} href={getLink(item)}>
                            {item}
                        </Link>
                    </Navbar.CollapseItem>
                ))}
            </Navbar.Collapse>
        </Navbar >
    )
}