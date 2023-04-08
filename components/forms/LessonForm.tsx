import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import TextInput from 'components/forms/TextInput';
import TextAreaInput from 'components/forms/TextAreaInput';
import { Lesson } from "@prisma/client";
import ActionButton from "./ActionButton";
import BackButton from "./BackButton";
import { Spacer } from "@nextui-org/react";
import { MouseEventHandler } from "react";

export type Inputs = {
  name: string;
  description: string;
};

type Props = {
  lesson?: Lesson;
  onSubmit: SubmitHandler<Inputs>;
  isLoading: boolean;
  onDelete: MouseEventHandler;
  isDeleteLoading: boolean;
}


function LessonForm({ lesson, onSubmit, isLoading, onDelete, isDeleteLoading }: Props) {
  const methods = useForm<Inputs>({ defaultValues: { name: lesson?.name, description: lesson?.description } });

  return (
    <FormProvider {...methods}>
      <form className='flex flex-col max-w-lg'>
        <TextInput label='Name' name='name' options={{ required: true }} />
        <TextAreaInput label='Description' name='description' options={{ required: true }} />
        <ActionButton value={`${lesson ? 'Update' : 'Create'}`} color="primary" isLoading={isLoading} onClickEvent={methods.handleSubmit(onSubmit)} />
        <Spacer />
        <ActionButton value="Delete" color="error" isBordered isLoading={isDeleteLoading} onClickEvent={onDelete} />
        <Spacer />
        <BackButton label="Done" url={`/admin/courses/${lesson?.courseId}`}/>
      </form>
    </FormProvider>
  );
}

export default LessonForm;