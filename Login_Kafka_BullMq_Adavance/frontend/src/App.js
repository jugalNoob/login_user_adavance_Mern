import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Admin from './page/Admin';
import Dash from './page/Dash';
import Forget from './page/Forget';
import From from './page/From';
import Home from './page/Home';
import Login from './page/Login';
import Nav from './page/Nav';
import DashboardG from './page/DashboardG';
import Admin from './page/Admin'

// Wrap your routes inside the Nav component
const router = createBrowserRouter([
  {
    path: "/", 
    element: <Nav />, // Nav wraps around pages
    // errorElement: <Error />,
    children: [
      {
        path: "/", 
        element: <Home />
      },
      {
        path: "/from", 
        element: <From />
      },
      {
        path: "/login", 
        element: <Login />
      },
      {
        path: "/dash", 
        element: <Dash />
      },
      {
        path: "/forget", 
        element: <Forget />
      },
   
      { path: "/admin", element: <Admin/> }, // lowercase recommended
 
      {
        path: "/admin/:id", 
        element: <Admin/>

      },



          { path: "/dashboardg", element: <DashboardG /> }, // lowercase recommended
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;




// import React from 'react';
// import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import Dash from './page/Dash';
// import Error from "./page/Error";
// import Forget from './page/Forget';
// import From from './page/From';
// import Home from './page/Home';
// import Login from './page/Login';
// import Nav from './page/Nav';

// // Wrap your routes inside the Nav component
// const router = createBrowserRouter([

 
//       {
//         path: "/", 
//         element: <Home />
//       },
//       {
//         path: "/from", 
//         element: <From />
//       },
//       {
//         path: "/login", 
//         element: <Login />
//       },
//       {
//         path: "/dash/:id", 
//         element: <Dash />
//       },
//       {
//         path: "/forget", 
//         element: <Forget />
//       }
 

// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;
