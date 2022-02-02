import { HelmetProvider } from 'react-helmet-async';
import Router from 'routers';
import AuthProvider from 'features/context/authContext';
import UserInfoProvider from 'features/context/userInfoContext';
import FoodLogProvider from 'features/context/foodLogContext';

function App() {

  return (
    <HelmetProvider>
      <AuthProvider>
        <UserInfoProvider>
          <FoodLogProvider>
            <Router />
          </FoodLogProvider>
        </UserInfoProvider>
      </AuthProvider>
    </HelmetProvider>

  );
}

export default App;
