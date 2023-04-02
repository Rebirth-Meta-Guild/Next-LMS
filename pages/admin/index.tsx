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
import toast from 'react-hot-toast'

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

  if (session) {
    return (
      <Grid.Container gap={1} justify="center">
        <Grid sm={8} xs={12}>
          <Heading>Upload Courses</Heading>
        </Grid>
        <Grid sm={1} xs={12}>
          <ActionButton value="Create a course" onClickEvent={addNewCourse} color="warning" isLoading={isAddNewCourseLoading} />
        </Grid>
        <Grid>
          {courses.length > 0 ? (
            <CourseGrid courses={courses} isAdmin />
          ) : (
            <div>
              <Heading as='h3'>You don&apos;t have any courses yet.</Heading>
            </div>
          )}
        </Grid>
      </Grid.Container>
    )
  }
  return <p>Access Denied</p>
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