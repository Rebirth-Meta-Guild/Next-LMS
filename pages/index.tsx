import type { NextPage, GetStaticProps, GetServerSideProps } from 'next'
import type { Course, Lesson, Video } from "@prisma/client"
import { prisma } from 'utils/prisma'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getServerSession } from "next-auth/next"
import Heading from 'components/Heading'
import CourseGrid from 'components/CourseGrid'
import { useAddress, useContract, useContractMetadata, useOwnedNFTs } from '@thirdweb-dev/react'

type HomePageProps = {
  courses: (Course & {
    lessons: (Lesson & {
      video: Video | null;
    })[];
  })[]
}

const contractAddress = "0xffbC0b872371623b5144b87F3fCAd1bbb221AA89"

const Home: NextPage<HomePageProps> = ({ courses }) => {
  const address = useAddress();
  const { contract } = useContract(contractAddress, "nft-drop");
  const { data: ownedNfts, isLoading } = useOwnedNFTs(contract, address);

  return (
    <>
      {isLoading ? "Loading...." : ownedNfts?.length}
      {courses.length > 0 ? (<Heading>Available Courses</Heading>) : (<Heading>No Available Courses</Heading>)}
      {courses.find(course => course.published === false) && (
        <Heading as="h4">Draft courses are only visible to you.</Heading>
      )}
      <CourseGrid courses={courses} />
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  const courses = await prisma.course.findMany({
    where: {
      OR: [
        {
          published: true
        },
        {
          author: {
            id: session?.user?.id
          }
        },
      ],
    },
    include: { lessons: { include: { video: true } } }
  })

  return {
    props: {
      courses
    },
  }
}