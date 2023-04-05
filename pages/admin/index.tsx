import type { NextPage } from 'next'
import { prisma } from 'utils/prisma'
import { useSession } from "next-auth/react"
import { GetServerSideProps } from 'next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import type { Session } from 'next-auth'
import type { Course, Lesson, Video } from '@prisma/client'
import CourseGrid from 'components/CourseGrid'

import Heading from 'components/Heading'
import { Grid, Button } from '@nextui-org/react'
import router from 'next/router'
import ActionButton from 'components/forms/ActionButton'
import { useState } from 'react'

type AdminIndexPageProps = {
  session: Session;
  courses: (Course & {
    lessons: (Lesson & {
      video: Video | null;
    })[];
  })[]
}

const AdminIndex: NextPage<AdminIndexPageProps> = ({ courses }) => {
  const { data: session } = useSession()
  const [isAddNewCourseLoading, setIsAddNewCourseLoading] = useState(false);

  const addNewCourse = () => {
    setIsAddNewCourseLoading(true);
    router.push('/admin/courses/new');
  };

  return (
    <Grid.Container gap={2} justify="center">
      <Grid>
        {session && (session.user.role == "admin" || session.user.role == "teacher") ?
          <>
            <Heading>
              Upload Courses
            </Heading>
            <Heading>
              <ActionButton value="Create a course" onClickEvent={addNewCourse} color="primary" isLoading={isAddNewCourseLoading} />
            </Heading>
            <CourseGrid courses={courses} isAdmin />
          </>
          :
          <Heading>Access Denied</Heading>
        }
      </Grid>
    </Grid.Container>
  )
}

export default AdminIndex

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/admin/login',
        permanent: false,
      },
    }
  }

  const courses = await prisma.course.findMany({
    where: {
      author: {
        id: session.user?.id
      }
    },
    include: {
      lessons: {
        include: {
          video: true
        }
      }
    }
  })

  return {
    props: {
      session,
      courses
    },
  }
}