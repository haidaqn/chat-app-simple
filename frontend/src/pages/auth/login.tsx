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
import { LoginType } from '@/models';

const Login = () => {
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
  });

  const form = useForm({
    resolver: yupResolver(shemaLogin),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit: SubmitHandler<LoginType> = (data) => {};

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input className="rounded-full p-6" placeholder="Enter email name.." {...field} />
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
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <InputPassword
                  className="rounded-full p-6"
                  placeholder="Enter password.."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="rounded-full p-4">
          Login
        </Button>
      </form>
    </Form>
  );
};
export default Login;
