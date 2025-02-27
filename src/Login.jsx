import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";

import "./index.css";

import LoginNavBar from "./LoginNavBar";
import Footer from "./shared/Footer";

function LoadingScreen() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backdropFilter: "blur(1px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "100px",
          height: "100px",
          border: "15px solid #D8D9DA",
          borderTopColor: "grey",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>
      <b>Please Wait</b>
    </div>
  );
}

const Login = () => {
  // const serverPath1 = "http://127.0.0.1:5000"
  const serverPath1 = "https://gpaserver2.onrender.com";

  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const [verifyOTP, setVerifyOTP] = useState(false);

  const [receivedOTP, setReceivedOTP] = useState(0);
  const [userOTP, setUserOTP] = useState(0);
  const [userToken, setUserToken] = useState("");
  const [openNewPasswordContainer, setOpenNewPasswordContainer] =
    useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // FRONTEND

  const [loginOpen, setLoginOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token_for_first_time");
    if (location.pathname === "/login" && token) {
      localStorage.removeItem("token_for_first_time");
      localStorage.removeItem("token");
      localStorage.removeItem("GuideName");
      localStorage.removeItem("GuideMailId");
      localStorage.removeItem("userMailId");
      console.log("Token removed from local storage");
    }
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");

    
    if (token) {
      const headers = {
        'Authorization': `${token}`
      };
      const func=async()=>{
        const response = await axios.get(serverPath1+"/checkAuthentication/"+userEmail, {headers});
        if (response.data.message=="Authenticated"){
          navigate("/dashboard");
        }
        else{
          localStorage.removeItem("token");
        }
      }
      func();
      
    }else{
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
      navigate("/login");
    }
  }, [location]);

  const handleFirstLogin = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    if (!verifyOTP) {
      console.warn(serverPath1 + "/api/check/" + formData["email"]);
      try {
        const response = await axios.get(
          serverPath1 +
            "/api/check/" +
            formData["email"] +
            "/" +
            formData["password"]
        );
        console.warn(response.data);

        if (response.data.is_account_available == "false") {
          console.warn("enter valid user account");
          setIsLoading(false);
          alert("enter valid user account");
        } else if (
          response.data.first_time == "false" &&
          response.data.is_account_available == "true" &&
          response.data.is_password_correct == "false"
        ) {
          setIsLoading(false);
          console.warn("password incorrect");
          alert("password incorrect");
        } else if (
          response.data.first_time == "false" &&
          response.data.is_account_available == "true" &&
          response.data.is_password_correct == "true"
        ) {
          setIsLoading(false);
          console.warn("Login Success");
          // alert("Login Success");
          setUserToken(response.data.token);
          console.warn(response.data.token);

          localStorage.setItem("token", response.data.token);
          localStorage.setItem("teamId", response.data.teamId);
          localStorage.setItem("userEmail", response.data.userEmail);


          navigate("/dashboard");
        } else if (
          response.data.first_time === "true" &&
          response.data.is_account_available == "true"
        ) {
          setIsLoading(false);
          console.warn("I am  called");
          const o = { _id: response.data._id };

          if (response.data.Is_Email_sent == "true");
          {
            setLoginOpen(false);
            setVerifyOTP(true);
            setReceivedOTP(response.data.OTP);
            setUserToken(response.data.token);
            const token = response.data.token_for_first_time;
            console.warn(token);
            localStorage.setItem("token_for_first_time", token);
            localStorage.setItem("userEmail", formData["email"]);
            localStorage.setItem("userName", response.data.name);
            localStorage.setItem("userPhoneNo", response.data.phoneNo);
            localStorage.setItem("userSection", response.data.section);
            localStorage.setItem("userRegNo", response.data.regNo);

            



          }
          if (response.data.Is_Email_sent == "false") {
            console.warn("Email not sent");
          }
        } else {
          console.warn("cannot processed");
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  // const handleSubmit = async(e)=>{
  //   e.preventDefault();

  //   if(!verifyOTP){
  //     console.warn('http://localhost:5000/api/check/'+formData['email'])
  //     try{
  //       const response = await axios.get('http://localhost:5000/api/check/'+formData['email']);
  //       console.warn(response.data);
  //       if (response.data.is_account_available==='true');
  //       {
  //         const o ={_id:response.data._id}
  //         // setObjId({_id:ObjectID(response.data._id)});
  //         setObjId(o)
  //         console.warn(o);
  //         try{
  //           console.warn("trying")
  //           const sendPositiveresponse = await axios.get("http://localhost:5000/api/check/verified/"+formData['email']+"/"+objId["_id"]);
  //           console.warn(sendPositiveresponse.data)
  //           if(sendPositiveresponse.data.Is_Email_sent);
  //           {
  //               setVerifyOTP(true);
  //               setReceivedOTP(sendPositiveresponse.data.OTP)
  //           }
  //         } catch(error){
  //           console.warn("to send verified note")
  //           console.warn(error)
  //         }
  //       }
  //     } catch(error){
  //       console.warn(error);
  //     }
  //   }
  // };

  const checkOTP = (e) => {
    e.preventDefault();

    if (userOTP) {
      if (userOTP == receivedOTP) {
        console.warn("LCorrect otp entered");

        setVerifyOTP(false);

        setOpenNewPasswordContainer(true);
      } else {
        console.warn(openNewPasswordContainer);
        alert("You have entered wrong OTP");
        console.warn("Wrong OTP");
      }
    } else {
      alert("Enter correct OTP");
    }
  };

  const continueRegister = (e) => {
    e.preventDefault();

    if (newPassword == newConfirmPassword) {
      localStorage.setItem("newPassword", newPassword);
      navigate("/login/select_team");
    } else {
      console.warn("both are not same");
    }
  };

  if (localStorage.getItem("token") == null) {
    return (
      <>
        <LoginNavBar />

        {isLoading && <LoadingScreen />}

        <div className="login_bg px-10 xs:px-10">
          <div className="lg:w-1/4 md:w-2/4 s:w-2/4 xs:w-3/4 border bg-white bg-opacity-40 backdrop-filter p-6 rounded-lg shadow-lg">
            <div className={loginOpen ? "block" : "hidden"}>
              <div className={loginOpen ? " flex justify-center" : "hidden"}>
                <h1 className="p-4 font-semibold text-2xl">LOGIN</h1>
              </div>

              <div className="justify-center">
                <form onSubmit={handleFirstLogin}>
                  <input
                    className="border-2 border-solid border-black rounded-lg px-2 h-12 my-4 w-full"
                    type="text"
                    placeholder="Email or Team ID"
                    value={formData.email}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <input
                    className="border-2 border-solid border-black rounded-lg h-12 px-2 my-4 w-full"
                    type="text"
                    placeholder="Password"
                    value={formData.password}
                    required
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />

                  <div className=" flex justify-center">
                    <button
                      className={
                        verifyOTP
                          ? "hidden p-3"
                          : "bg-red-900 text-white px-6 py-2 rounded-md my-2 text-lg"
                      }
                      type="submit"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className={verifyOTP ? "visible" : "hidden"}>
              <div className={true ? " flex justify-center" : "hidden"}>
                <h1 className="p-4 font-semibold text-2xl">Verify OTP</h1>
              </div>
              <form>
                <div className=" flex justify-center">
                  <input
                    className="border-2 border-solid border-black rounded-lg px-2 h-12 my-4 w-fit tracking-widest"
                    type="number"
                    placeholder="o  t  p"
                    maxLength="6"
                    value={formData.otp}
                    onChange={(e) => setUserOTP(e.target.value)}
                  />
                </div>

                <div className=" flex justify-center">
                  <button
                    onClick={checkOTP}
                    className="bg-red-900 text-white px-6 py-2 rounded-md my-2 text-lg"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>

            <div className={openNewPasswordContainer ? "visible" : "hidden"}>
              <div className={true ? " flex justify-center" : "hidden"}>
                <h1 className="p-4 font-semibold text-2xl">Set Password</h1>
              </div>

              <form>
                <input
                  className="border-2  border-solid border-black rounded-lg px-2 h-12 my-4 w-full"
                  type="text"
                  placeholder="new password"
                  value={newPassword}
                  required
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <input
                  className="border-2  border-solid border-black rounded-lg px-2 h-12 my-4 w-full"
                  type="text"
                  placeholder="confirm password"
                  value={newConfirmPassword}
                  required
                  onChange={(e) => setNewConfirmPassword(e.target.value)}
                />

                <div className=" flex justify-center">
                  <button
                    onClick={continueRegister}
                    className="bg-red-900 text-white px-6 py-2 rounded-md my-2 text-lg"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* <h1>geddadavenkatapradeep@gmail.com</h1> */}
        {/* <h1>govinduraju3288@gmail.com</h1> */}

        {/* <form onSubmit={handleFirstLogin}>
    

        <input
        className='border-2'
          type="email"
          placeholder="Email"
          value={formData.email}
          required
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <input
        className='border-2'
          type="text"
          placeholder="password"
          value={formData.password}
          required
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <button className={verifyOTP ? 'hidden p-3':'h-10 p-2 bg-red-600 text-black'} type="submit">Submit</button>
      </form> */}

        {/* <div className={verifyOTP ? 'visible':'hidden'}>
      <form >
      <input
        className='border-2'

          type="number"
          placeholder="o  t  p"
          value={formData.otp}
          onChange={(e) => setUserOTP(e.target.value )}
        />
          <button onClick={checkOTP} className="h-10 p-2 bg-red-600 text-black" type="submit">Submit</button>

      </form>
      </div> */}

        {/* <div className={openNewPasswordContainer ? "visible":"hidden"}>
        <form>

        <input
        className='border-2'

          type="text"
          placeholder="new password"
          value={newPassword}
          required
          onChange={(e) => setNewPassword(e.target.value )}
        />

        <input
        className='border-2'

          type="text"
          placeholder="confirm password"
          value={newConfirmPassword}
          required
          onChange={(e) => setNewConfirmPassword(e.target.value )}
        />

        <button onClick={continueRegister} className='h-10 p-2 bg-red-600 text-black' type="submit">Submit</button>


        </form>
      </div> */}

        <Footer />
      </>
    );
  } else {
    navigate("/dashboard");
  }
};

export default Login;
