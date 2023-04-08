import type { NextPage, GetServerSideProps } from "next";
import type { User } from "@prisma/client";
import { prisma } from "utils/prisma";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import Heading from "components/Heading";
import { useSession } from "next-auth/react";
import { Button, Container, Grid, Popover, Table, User as UserComponent } from "@nextui-org/react";
import RoleBadge from "components/RoleBadge";
import UpdateRole, { Inputs } from "components/UpdateRole";

type UsersPageProps = {
  users: User[];
};

const columns = [
  { name: "NAME", uid: "name" },
  { name: "WALLET", uid: "wallet" },
  { name: "ROLE", uid: "role" },
  { name: "ACTIONS", uid: "actions" },
];

const Users: NextPage<UsersPageProps> = ({ users }) => {
  const { data: session } = useSession();

  if (session?.user.role == "admin") {
    return (
      <Grid.Container justify="center">
        <Grid xs={12}>
          {users.length > 0 ? (
            <Container>
              <Heading>View Users</Heading>
              <Table selectionMode="none" css={{ height: "auto", minWidth: "100%" }}>
                <Table.Header columns={columns}>
                  {(column) => (
                    <Table.Column
                      key={column.uid}
                      hideHeader={column.uid === "actions"}
                      align={column.uid === "actions" ? "center" : "start"}
                    >
                      {column.name}
                    </Table.Column>
                  )}
                </Table.Header>
                <Table.Body items={users}>
                  {(item: User) => (
                    <Table.Row key={item.id}>
                      <Table.Cell>
                        {item.image ? (
                          <UserComponent src={item.image} name={item.name} color="primary">
                            {item.email}
                          </UserComponent>
                        ) :
                        (
                          <UserComponent src="/images/user.png" name={item.name} color="primary">
                            {item.email}
                          </UserComponent>
                        )}
                      </Table.Cell>
                      <Table.Cell>{item.metamaskAddress}</Table.Cell>
                      <Table.Cell><RoleBadge role={item.role} /></Table.Cell>
                      <Table.Cell>
                        {item.role != "admin" && (
                          <Popover>
                            <Popover.Trigger>
                              <Button color="primary" size="sm">Edit</Button>
                            </Popover.Trigger>
                            <Popover.Content css={{ height: "150px" }}>
                              <UpdateRole user={item} />
                            </Popover.Content>
                          </Popover>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
                <Table.Pagination
                  noMargin
                  align="center"
                  rowsPerPage={10}
                  onPageChange={(page) => console.log({ page })}
                />
              </Table>
            </Container>

          ) : (
            <Heading>There are no users to view</Heading>
          )}

        </Grid>
      </Grid.Container>
    );
  }
  return <p>Access Denied</p>;
};

export default Users;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    }
  }
  const users = await prisma.user.findMany();

  return {
    props: {
      users,
    },
  };
};
