import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { RegisterType } from '@/models';

const Register = () => {
  const shemaLogin = yup.object().shape({
    email: yup
      .string()
      .email('Please enter the correct format!')
      .max(255)
      .required('Email cannot be empty!!'),
    password: yup
      .string()
      .required('Need to enter password!')
      .min(6, 'Password must have at least 6 characters'),
    passwordConfirm: yup
      .string()
      .required('Need to enter password to confirm!')
      .min(6, 'Password must have at least 6 characters')
      .oneOf([yup.ref('password')], 'Password incorrect'),
  });

  const form = useForm({
    resolver: yupResolver(shemaLogin),
    defaultValues: {
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const handleSubmit: SubmitHandler<RegisterType> = (data) => {};

  return (
    <Form {...form}>
      <form className="flex flex-col gap-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input className="rounded-full p-4" placeholder="Enter email name.." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="px-1">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <InputPassword
                  className="rounded-full p-4"
                  placeholder="Enter password.."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem className="px-1">
              <FormLabel>Confirm Pasword</FormLabel>
              <FormControl>
                <InputPassword
                  className="rounded-full p-4"
                  placeholder="Enter password confirm.."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="rounded-full p-4">
          Register
        </Button>
      </form>
    </Form>
  );
};

export default Register;
