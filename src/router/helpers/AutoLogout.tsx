import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setProvider } from "../../features/Provider/providerSlice";
import { useDispatch } from "react-redux";

const events = [
  "load",
  "mousemove",
  "mousedown",
  "click",
  "scroll",
  "keypress",
];

const AutoLogout = ({ children }: { children: React.ReactNode }) => {
  let timer: any;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // when component mounts, it adds an event listeners to the window
  // each time any of the event is triggered, i.e on mouse move, click, scroll, keypress etc, the timer to logout user after 15min of inactivity resets.
  // However, if none of the event is triggered within 15min, that is app is inactive, the app automatically logs out.
  useEffect(() => {
    Object.values(events).forEach((item) => {
      window.addEventListener(item, () => {
        resetTimer();
        handleLogoutTimer();
      });
    });
  }, []);

  // this function sets the timer that logs out the user after 15min
  const handleLogoutTimer = () => {
    timer = setTimeout(() => {
      // clears any pending timer.
      resetTimer();
      // Listener clean up. Removes the existing event listener from the window
      Object.values(events).forEach((item) => {
        window.removeEventListener(item, resetTimer);
      });
      // logs out user
      logoutAction();
    }, 43200000); // 900000 = 15 minutes You can change the time.
  };
  // this resets the timer if it exists.
  const resetTimer = () => {
    if (timer) clearTimeout(timer);
  };

  // logs out user by clearing out auth token in localStorage and redirecting url to /signin page.
  const logoutAction = () => {
    navigate("/");
    dispatch(
      setProvider({
        isAuthenticated: false,
      })
    );
  };

  return children;
};

export default AutoLogout;
