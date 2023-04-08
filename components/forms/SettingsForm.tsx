import { FormProvider, useForm, SubmitHandler } from "react-hook-form";
import TextInput from './TextInput';
import TextAreaInput from './TextAreaInput';
import Checkbox from "./Checkbox";
import { User } from "@prisma/client";
import ActionButton from "./ActionButton";
import BackButton from "./BackButton";
import { Spacer } from "@nextui-org/react";

export type Inputs = {
  name: string | null;
  email: string | null;
};

type Props = {
  user?: User;
  onSubmit: SubmitHandler<Inputs>;
  isLoading: boolean;
}

const SettingsForm = ({ user, onSubmit, isLoading }: Props) => {
  const methods = useForm<Inputs>({ defaultValues: { name: user?.name, email: user?.email}});

  return (
    <FormProvider {...methods}>
      <form className='flex flex-col max-w-lg'>
        <TextInput label='Name' name='name' options={{ required: true }} />
        <TextAreaInput label='Email Address' name='email' options={{ required: true }} />
        <ActionButton value={`Update Settings`} color="primary" isLoading={isLoading} onClickEvent={methods.handleSubmit(onSubmit)} />
        <Spacer />
        <BackButton url={`/`}/>
      </form>
    </FormProvider>
  )
}

export default SettingsForm;