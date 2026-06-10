import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import router from "@router/router";
import ErrorBoundary from "@shared/components/error/ErrorBoundary";
import SplashScreen from "@shared/components/SplashScreen";
import { ConfirmProvider, ToastProvider } from "@shared/components/feedback";

const App = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <ConfirmProvider>
          <Suspense fallback={<SplashScreen />}>
            <RouterProvider router={router} />
          </Suspense>
        </ConfirmProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
