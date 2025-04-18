const AuthenticationEmptyNavbar = () => {
  // Need to make image more precise using img component
  return (
    <div className="lg:top-0 lg:absolute lg:w-full lg:z-10 lg:h-16 lg:bg-white lg:shadow lg:justify-start lg:items-center lg:inline-flex">
      <div className=" lg:self-stretch lg:pl-[73px] lg:flex-col lg:justify-center lg:items-center lg:inline-flex">
        <div className="lg:pl-[73px] lg:w-full lg:bg-medical-home-logo lg:bg-no-repeat lg:bg-center lg:h-full" />
      </div>
    </div>
  );
};

export default AuthenticationEmptyNavbar;
