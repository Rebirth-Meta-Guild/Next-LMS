import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import Checkbox from "./Checkbox";
import { Course } from "@prisma/client";
import ActionButton from "./ActionButton";
import BackButton from "./BackButton";
import { Spacer } from "@nextui-org/react";

export type Inputs = {
  name: string;
  description: string;
  published: boolean;
};

type Props = {
  course?: Course;
  onSubmit: SubmitHandler<Inputs>;
  isLoading: boolean;
}

const CourseForm = ({ course, onSubmit, isLoading }: Props) => {
  const methods = useForm<Inputs>({ defaultValues: { name: course?.name, description: course?.description, published: course?.published } });

  return (
    <FormProvider {...methods}>
      <form className='flex flex-col max-w-lg'>
        <TextInput label='Name' name='name' options={{ required: true }} />
        <TextAreaInput label='Description' name='description' options={{ required: true }} />
        <Checkbox label='Publish' name='published'/>
        <ActionButton value={`${course ? 'Update' : 'Create'} course`} color="primary" isLoading={isLoading} onClickEvent={methods.handleSubmit(onSubmit)} />
        <Spacer />
        <BackButton url={`/admin`}/>
      </form>
    </FormProvider>
  )
}

export default CourseForm;