import  { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from "../animation/Loader"
import {  toast } from "react-toastify";

const LoginModal = () => {
 
  const {setShowLogin,backendUrl,loginData,setLogin,setToken,Token, setLoginData} =useContext(AppContext)
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls

   const navigate = useNavigate();




   useEffect(()=>{
    if(Token)
    {
      const fetchUser = async () => {
        try {
          const response = await axios.get(backendUrl+"/user/me", {
            headers: { Authorization: `Bearer ${Token}` },
          });

          
          if (response.data.success) {
            setLoginData(response.data.user); // Includes avatarUrl
            setLogin(true);
          }
        } catch (error) {
          
          setLogin(false);
          setToken("");
          localStorage.removeItem("token");
          
        }
      };
      fetchUser();
    }
  },[Token])

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Show loader when starting API call

    if (isLogin) {
      try {
        const data = await axios.post(backendUrl+"/user/login", {
          email,
          password,
        });

       
        if(data.data.success)
        {

          
          setLoginData(data.data.user);
          setToken(data.data.token);
          localStorage.setItem("token",Token);
          setLogin(true);
          setShowLogin(false);
          toast.success("Welcome again...!")

        // Clear form fields after successful login
          setEmail('');
          setPassword('');
          
        }
        else{
          toast.error("something went wrong "); 
        }

      } catch (error) {
        toast.error("some internal error"); 
      }
      finally {
        setIsLoading(false); // Hide loader when API call completes
      }
    } else {
      try {
        const data = await axios.post(backendUrl+"/user/register", {
          name,
          email,
          password,
        });

        
        if(data.data.success)
          {
  
            setLoginData(data.data.user);
            setToken(data.data.token);
            localStorage.setItem("token",Token);
            
            setLogin(true);
            setShowLogin(false);
            toast.success("Welcome to Traveler's Diary...!")
           
            // Clear form fields after successful registration
          setName('');
          setEmail('');
          setPassword('');

            


          }
        
      } catch (error) {
        toast.error("some internal error");
       }
      finally {
        setIsLoading(false); // Hide loader when API call completes
      }
    }
  };

 



  return (
    <div className="flex items-center z-[99]  mt-[-25px] justify-center  relative min-h-screen ">
      <div className="w-[350px] border relative border-teal-900 bg-gray-800   shadow-lg rounded-lg p-6">
         {/* Loader displays during API calls */}
       
        




        <button onClick={()=>{
          setShowLogin(false)
          navigate("/")
        }}
        disabled={isLoading} // Disable close button during loading
        > 
        <img  src={assets.cross_icon } className='absolute cursor-pointer filter invert   w-6  top-1 right-1' alt="" />

        </button>
        <h2 className="text-center text-white font-['Lucida_Sans'] text-3xl font-extrabold mb-6">
          {isLogin ? 'Welcome back' : 'Create account'}
        </h2>

        {/* Subtitle for Registration */}
        {!isLogin && (
          <p className="text-center  text-gray-400 font-['Lucida_Sans'] text-xs mb-4">
            Let&#39;s get started with your 30 days free trial
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-4">
          {!isLogin && (
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            
              placeholder="Name"
              className="w-full px-4 py-3 rounded-full text-gray-300 bg-gray-800 border border-gray-400 "
              disabled={isLoading}
            />
          )}
          <input
            type="email"
            value={email}
           onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-full  text-gray-300 border bg-gray-800  border-gray-300 "
            disabled={isLoading}
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
           
            placeholder="Password"
            className="w-full px-4 py-3 rounded-full text-gray-300 bg-gray-800  border border-gray-300 "
            disabled={isLoading}
          />
          
          {isLogin && (
            <p className="text-right text-gray-300 text-xs">
              <span className="cursor-pointer hover:text-black">
                Forgot Password?
              </span>
            </p>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-teal-600 text-white rounded-full font-['Lucida_Sans'] shadow-md hover:shadow-none transition-shadow"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : (isLogin ? 'Log in' : 'Create account')}
          </button>
        </form> 

        {/* Center the Loader over the form */}
        {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader />
            </div>
          )}

        {/* Toggle Link */}
        <p className="text-center text-gray-500 text-xs font-['Lucida_Sans']">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <span
            className="ml-1 text-teal-600 underline cursor-pointer font-bold hover:text-teal-700"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </span>
        </p>

        {/* Social Login Buttons */}
        <div className="mt-6 flex flex-col gap-4">
          <button className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-black text-white rounded-full shadow-lg border-2 border-black hover:shadow-md transition-shadow">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 1024 1024"
              xmlns="http://www.w3.org/2000/svg"
              disabled={isLoading}
              
            >
              <path d="M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8 23.8 68.2 109.6 235.3 199.1 232.6 46.8-1.1 79.9-33.2 140.8-33.2 59.1 0 89.7 33.2 141.9 33.2 90.3-1.3 167.9-153.2 190.5-221.6-121.1-57.1-114.6-167.2-114.6-170.7zm-105.1-305c50.7-60.2 46.1-115 44.6-134.7-44.8 2.6-96.6 30.5-126.1 64.8-32.5 36.8-51.6 82.3-47.5 133.6 48.4 3.7 92.6-21.2 129-63.7z" />
            </svg>
            <span className="font-['Lucida_Sans'] text-sm">
              {isLogin ? 'Log in' : 'Sign up'} with Apple
            </span>
          </button>

          <button className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white text-gray-700 rounded-full shadow-lg border-2 border-gray-500 hover:shadow-md transition-shadow"
          disabled={isLoading}
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            <span className="font-['Lucida_Sans'] text-sm">
              {isLogin ? 'Log in' : 'Sign up'} with Google
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;