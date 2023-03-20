import type { GetServerSideProps, NextPage } from 'next'
import { SubmitHandler } from "react-hook-form";
import { useRouter } from 'next/router'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast';

import Heading from 'components/Heading';
import CourseForm, { Inputs } from 'components/forms/CourseForm';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';

type CourseCreateResult = {
  id: number;
}

const AdminNewCourse: NextPage = () => {
  const router = useRouter()
  const handler = (newCourse: Inputs) => {
    return fetch('/api/courses', {
      method: 'POST', body: JSON.stringify(newCourse)
    }).then(res => res.json())
  }

  const mutation = useMutation(handler, {
    onSuccess: (data: CourseCreateResult) => {
      router.push(`/admin/courses/${data.id}`)
    },
    onError: (error) => {
      console.error(error)
      toast.error('Something went wrong')
    }
  })

  const onSubmit: SubmitHandler<Inputs> = async data => {
    mutation.mutate(data);
  };

  return (
    <>
      <Heading>Add a course</Heading>
      <CourseForm onSubmit={onSubmit} isLoading={mutation.isLoading} />
    </>
  );

}

export default AdminNewCourse

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
  return {
    props: {
      session
    },
  }
}
