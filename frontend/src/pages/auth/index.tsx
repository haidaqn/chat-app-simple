import Background from '@/assets/login2.png';
import Victory from '@/assets/victory.svg';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import Register from './register';
import Login from './login';

const Auth = () => {
  return (
    <div className="h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-[95vh] bg-white border-2 border-white text-opacity-90 rounded-3xl grid xl:grid-cols-2 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70w] xl:w-[60vw] ">
        <div className="flex flex-col gap-10 items-center justify-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center">
              <h1 className="text-5xl font-bold md:text-6xl">welcome</h1>
              <img src={Victory} alt="victory moji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fil in the details to get started with the best chat app!
            </p>
          </div>
          <div className="flex items-center justify-center w-full">
            <Tabs defaultValue="login" className="w-3/4">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  className="w-full data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-ful data data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 ease-in-out"
                  value="login"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  className="w-full data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-ful data data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300 ease-in-out"
                  value="signup"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              <TabsContent className="flex flex-col gap-5 mt-10" value="login">
                <Login />
              </TabsContent>
              <TabsContent className="" value="signup">
                <Register />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="background img" className="h-[600px]" />
        </div>
      </div>
    </div>
  );
};
export default Auth;
