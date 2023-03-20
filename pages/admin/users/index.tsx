import type { NextPage, GetStaticProps, GetServerSideProps } from "next";
import type { User } from "@prisma/client";
import { prisma } from "utils/prisma";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import Heading from "components/Heading";
import { useSession } from "next-auth/react";

type UsersPageProps = {
  users: User[];
};

const Users: NextPage<UsersPageProps> = ({ users }) => {
  const { data: session } = useSession();

  if (session?.user.role == "admin") {
    return (
      <>
        {users.length > 0 ? (
          <Heading>View Users</Heading>
        ) : (
          <Heading>There are no courses to view</Heading>
        )}

        <div>
          <h1>Users</h1>
          <ul>
            {users.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>
      </>
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
