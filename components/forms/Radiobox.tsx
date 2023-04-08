import { useFormContext, RegisterOptions } from "react-hook-form";
import Field from "./Field"
import Label from "./Label"

type Props = {
  name: string;
  label: string;
  options?: RegisterOptions;
}

const Radiobox = ({ name, label, options = {} }: Props) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <Field>
      <div className="flex items-center gap-2">
        <input {...register(name, options)} type="radio" value="student" id="field-student" className="border-gray-200 form-radio" />
        <Label htmlFor="field-student">student</Label>
        <input {...register(name, options)} type="radio" value="teacher" id="field-teacher" className="border-gray-200 form-radio" />
        <Label htmlFor="field-teacher">teacher</Label>
      </div>
    </Field>
  )
}

export default Radiobox;



