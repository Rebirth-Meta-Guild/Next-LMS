import type { ReactElement } from 'react'
import { useState } from 'react'
import type { GetServerSideProps } from 'next'
import type { Course, Lesson, Video } from "@prisma/client"
import muxBlurHash from "@mux/blurhash";
import { prisma } from 'utils/prisma'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import { useSession } from "next-auth/react"
import Link from 'next/link'
import type { NextPageWithLayout } from 'pages/_app'
import CourseViewer from 'components/CourseViewer'
import Banner from 'components/Banner'
import NavBar from 'components/NavBar'
import Head from 'next/head';
import { useAddress, useContract, useOwnedNFTs } from '@thirdweb-dev/react';
import { Grid, Loading } from '@nextui-org/react';
import Heading from 'components/Heading';

const contractAddress = "0xffbC0b872371623b5144b87F3fCAd1bbb221AA89"

type VideoWithPlaceholder = Video & { placeholder?: string }

type ViewCoursePageProps = {
  course: (Course & {
    lessons: (Lesson & {
      video: VideoWithPlaceholder | null;
    })[];
  });
  completedLessons: number[];
}

const ViewCourse: NextPageWithLayout<ViewCoursePageProps> = ({ course, completedLessons }) => {
  const address = useAddress()
  const { data: session } = useSession()
  const { contract } = useContract(contractAddress, "nft-drop")
  const { data: ownedNfts, isLoading } = useOwnedNFTs(contract, address)
  const [lessonProgress, setLessonProgress] = useState(completedLessons)

  return (
    <Grid.Container justify="center">
      {address && isLoading ? (
        <Grid>
          <Loading color="warning" />
        </Grid>
      )
        : (
          session || (ownedNfts && ownedNfts?.length > 0) ? (
            <>
              <Banner>
                <p className='text-center'>
                  <Link href='/api/auth/signin'>
                    <a className='underline'>Sign in</a>
                  </Link> to track your progress &rarr;{' '}
                </p>
              </Banner>
              <CourseViewer course={course} lessonProgress={lessonProgress} setLessonProgress={setLessonProgress} />
            </>
          ) :
            (
              <Heading>Access Denied</Heading>
            )
        )
      }
    </Grid.Container>
  )
}

ViewCourse.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Project GodJira (PG) - Powered by Rebirth Labs</title>
        <meta name="description" content="Powered by Rebirth Labs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      {page}
    </>
  )
}

export default ViewCourse

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  const id = context?.query?.slug?.[0]
  if (typeof id !== "string") { throw new Error('missing id') };

  const course = await prisma.course.findUnique({
    where: { id: parseInt(id) },
    include: {
      lessons: {
        include: {
          video: true
        }
      }
    },
  })

  if (!course) {
    return { notFound: true }
  }

  if (course.published === false && course.authorId !== session?.user?.id) {
    return { notFound: true }
  }

  const completedLessons = await prisma.userLessonProgress.findMany({
    where: {
      userId: session?.user?.id,
      lessonId: {
        in: course.lessons.map(lesson => lesson.id)
      }
    }
  }).then(progress => progress.map(p => p.lessonId))

  course.lessons = await Promise.all(course.lessons.map(async (lesson) => {
    if (lesson?.video?.publicPlaybackId) {
      const { blurHashBase64 } = await muxBlurHash(lesson.video.publicPlaybackId);
      (lesson.video as VideoWithPlaceholder).placeholder = blurHashBase64;
    }
    return lesson
  }))

  return {
    props: {
      session,
      course,
      completedLessons
    },
  }
}
