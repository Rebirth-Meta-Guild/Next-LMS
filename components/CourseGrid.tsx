import CourseCard from 'components/CourseCard'
import type { Course, Lesson, Video } from "@prisma/client"
import Heading from './Heading';

type Props = {
  isAdmin?: boolean;
  courses: (Course & {
    lessons: (Lesson & {
      video: Video | null;
    })[];
  })[]
}

const CourseGrid = ({ courses, isAdmin = false }: Props) => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {courses.length > 0 ?
          courses.map(course => (
            <CourseCard key={course.id} course={course} isAdmin={isAdmin} />
          ))
        :
        <Heading as='h3'>You don&apos;t have any courses yet.</Heading>
      }
    </div>
  );
};

export default CourseGrid;