import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import TextInput from 'components/forms/TextInput';
import TextAreaInput from 'components/forms/TextAreaInput';
import SubmitInput from 'components/forms/SubmitInput';
import { Lesson } from "@prisma/client";
import ActionButton from "./ActionButton";

export type Inputs = {
  name: string;
  description: string;
};

type Props = {
  lesson?: Lesson;
  onSubmit: SubmitHandler<Inputs>;
  isLoading: boolean;
}

const LessonForm = ({ lesson, onSubmit, isLoading }: Props) => {
  const methods = useForm<Inputs>({ defaultValues: { name: lesson?.name, description: lesson?.description } });

  return (
    <FormProvider {...methods}>
      <form className='flex flex-col max-w-lg'>
        <TextInput label='Name' name='name' options={{ required: true }} />
        <TextAreaInput label='Description' name='description' options={{ required: true }} />
        <ActionButton value={`${lesson ? 'Update' : 'Create'}`} color="warning" isLoading={isLoading} onClickEvent={methods.handleSubmit(onSubmit)} />
      </form>
    </FormProvider>
  )
}

export default LessonForm;