import { useState } from 'react';
import type { NextPage, GetServerSideProps } from 'next'
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { useRouter } from 'next/router'
import { prisma } from 'utils/prisma'

import Mux from '@mux/mux-node';
const { Video } = new Mux(process.env.MUX_TOKEN_ID, process.env.MUX_TOKEN_SECRET);

import MuxUploader from '@mux/mux-uploader-react';
import { getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]'
import type { Session } from 'next-auth'
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import Heading from 'components/Heading';
import TextInput from 'components/forms/TextInput';
import TextAreaInput from 'components/forms/TextAreaInput';
import Field from 'components/forms/Field';
import ActionButton from 'components/forms/ActionButton';
import { Button, Container, Grid, Spacer } from '@nextui-org/react';
import BackButton from 'components/forms/BackButton';

type Inputs = {
  name: string;
  description: string;
  uploadId: string;
  courseId: string;
};

type AdminNewLessonPageProps = {
  session: Session;
  uploadUrl: string;
  uploadId: string;
}

type LessonCreateResult = {
  id: number;
}

const AdminNewLesson: NextPage<AdminNewLessonPageProps> = ({ uploadUrl, uploadId }) => {
  const router = useRouter()
  const courseId = router.query.courseId as string
  const [isVideoUploaded, setIsVideoUploaded] = useState(false)

  const methods = useForm<Inputs>();

  const handler = (data: Inputs) => {
    return fetch('/api/lessons', {
      method: 'POST', body: JSON.stringify(data)
    }).then(res => res.json())
  }

  const mutation = useMutation(handler, {
    onSuccess: (data: LessonCreateResult) => {
      router.push(`/admin/courses/${courseId}/lessons/${data.id}`)
      toast.success('Lesson created successfully')
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
    <Grid.Container gap={2} justify="center">
      <Grid sm={8} xs={12}>
        <Container>
          <Heading>New lesson</Heading>
          <FormProvider {...methods}>
            <form className='flex flex-col max-w-xl'>
              <TextInput label='Name' name='name' options={{ required: true }} />
              <TextAreaInput label='Description' name='description' options={{ required: true }} />
              <Field>
                <MuxUploader
                  endpoint={uploadUrl}
                  type="bar"
                  onSuccess={() => setIsVideoUploaded(true)}
                  className='w-full mb-6'
                />
              </Field>

              <input type="hidden" {...methods.register("uploadId", { value: uploadId, required: true })} />
              <input type="hidden" {...methods.register("courseId", { value: courseId, required: true })} />

              {isVideoUploaded && (
                <>
                  <ActionButton value="Create lesson" color="primary" isLoading={mutation.isLoading} onClickEvent={methods.handleSubmit(onSubmit)} />
                  <Spacer />
                </>
              )}
              <BackButton url={`/admin/courses/${courseId}`}/>
            </form>
          </FormProvider>
        </Container>
      </Grid>
    </Grid.Container>
  );
}

export default AdminNewLesson

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

  const upload = await Video.Uploads.create({
    cors_origin: 'https://localhost:3000',
    new_asset_settings: {
      playback_policy: ['public', 'signed'],
      passthrough: JSON.stringify({ userId: session.user?.id })
    }
  });

  await prisma.video.create({
    data: {
      uploadId: upload.id,
      owner: {
        connect: { id: session.user.id }
      }
    }
  });

  return {
    props: {
      session,
      uploadId: upload.id,
      uploadUrl: upload.url
    },
  }
}
